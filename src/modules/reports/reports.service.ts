import { prisma } from '../../utils/prisma';
import { Prisma } from '@prisma/client';

export interface ReportFilterParams {
  dateFrom?: Date;
  dateTo?: Date;
  doctor_id?: string;
  status?: string;
  payment_method?: string;
  groupBy?: 'day' | 'week' | 'month' | 'doctor';
  location_id?: number;
  gender?: string;
  city?: string;
  type?: string;
}

export class ReportsService {
  /**
   * Returns metadata catalog of available standard report templates & KPI configurations
   */
  async getCatalog() {
    return [
      {
        id: 'financial',
        title: 'Financial & Revenue Cycle (RCM)',
        description: 'Comprehensive analysis of billed vs. collected revenue, aging receivables, payment methods, and doctor fee earnings.',
        icon: 'DollarSign',
        category: 'Revenue & Billing',
        availableGroupings: ['day', 'week', 'month', 'doctor'],
        charts: ['revenue_trend', 'payment_distribution', 'ar_aging', 'invoice_status'],
      },
      {
        id: 'clinical',
        title: 'Clinical Outcomes & Epidemiology',
        description: 'Deep dive into common diagnoses, drug prescription frequencies, chronic disease distributions, and vital trend monitoring.',
        icon: 'Activity',
        category: 'Clinical & Patient Care',
        availableGroupings: ['day', 'month'],
        charts: ['top_prescriptions', 'allergy_distribution', 'visit_types', 'vitals_trend'],
      },
      {
        id: 'operational',
        title: 'Practice Operations & Schedule Utilization',
        description: 'Analyze appointment volume, fulfillment rates, no-shows, cancellation reasons, and doctor clinical throughput.',
        icon: 'Calendar',
        category: 'Operations & Staff',
        availableGroupings: ['day', 'week', 'month'],
        charts: ['appointment_funnel', 'doctor_utilization', 'peak_hours'],
      },
      {
        id: 'demographics',
        title: 'Patient Population & Growth Analytics',
        description: 'Track new patient acquisition rates, gender and age cohort demographics, geographic distributions, and referral sources.',
        icon: 'Users',
        category: 'Patient Demographics',
        availableGroupings: ['month', 'year'],
        charts: ['age_distribution', 'gender_split', 'patient_growth', 'referrals'],
      },
      {
        id: 'custom',
        title: 'Dynamic Data Explorer & Preset Builder',
        description: 'Custom query builder across Invoices, Appointments, Visits, and Patient registers with export capabilities.',
        icon: 'Sliders',
        category: 'Custom Analytics',
        availableGroupings: [],
        charts: ['custom_grid'],
      },
    ];
  }

  private buildDateRange(from?: Date, to?: Date) {
    if (!from && !to) {
      // Default to past 30 days if no dates specified
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    const start = from || new Date('2020-01-01T00:00:00.000Z');
    const end = to || new Date();
    if (to) {
      end.setHours(23, 59, 59, 999);
    }
    return { start, end };
  }

  /**
   * 1. Financial Report Suite
   */
  async getFinancialReport(params: ReportFilterParams) {
    const { start, end } = this.buildDateRange(params.dateFrom, params.dateTo);

    const invoiceWhere: Prisma.InvoiceWhereInput = {
      invoice_date: { gte: start, lte: end },
      deletedAt: null,
    };
    if (params.status) invoiceWhere.status = params.status;

    // Total billed vs collected in date range
    const invoices = await prisma.invoice.findMany({
      where: invoiceWhere,
      include: { patient: { select: { firstName: true, lastName: true, mrn: true } } },
      orderBy: { invoice_date: 'asc' },
    });

    const receipts = await prisma.receipt.findMany({
      where: {
        payment_date: { gte: start, lte: end },
        status: 1,
        deletedAt: null,
        ...(params.payment_method ? { payment_method: params.payment_method } : {}),
      },
      orderBy: { payment_date: 'asc' },
    });

    let totalBilled = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;

    const trendMap = new Map<string, { date: string; billed: number; collected: number }>();
    const invoiceStatusCount: Record<string, { count: number; total: number }> = {};
    const paymentMethodMap: Record<string, number> = {};

    invoices.forEach((inv) => {
      const net = parseFloat(inv.net_total.toString() || '0');
      const bal = parseFloat(inv.balance_amount.toString() || '0');
      totalBilled += net;
      totalOutstanding += bal;

      // Group by date string
      const dateStr = inv.invoice_date.toISOString().split('T')[0];
      const entry = trendMap.get(dateStr) || { date: dateStr, billed: 0, collected: 0 };
      entry.billed += net;
      trendMap.set(dateStr, entry);

      // Status breakdown
      const st = inv.status || 'draft';
      if (!invoiceStatusCount[st]) invoiceStatusCount[st] = { count: 0, total: 0 };
      invoiceStatusCount[st].count += 1;
      invoiceStatusCount[st].total += net;
    });

    receipts.forEach((rec) => {
      const amt = parseFloat(rec.amount.toString() || '0');
      totalCollected += amt;

      const dateStr = rec.payment_date.toISOString().split('T')[0];
      const entry = trendMap.get(dateStr) || { date: dateStr, billed: 0, collected: 0 };
      entry.collected += amt;
      trendMap.set(dateStr, entry);

      const pm = rec.payment_method || 'other';
      paymentMethodMap[pm] = (paymentMethodMap[pm] || 0) + amt;
    });

    // Accounts Receivable (A/R) Aging Analysis (Across ALL unpaid invoices regardless of date)
    const unpaidInvoices = await prisma.invoice.findMany({
      where: {
        status: { in: ['sent', 'partial', 'draft'] },
        deletedAt: null,
      },
      select: { invoice_date: true, balance_amount: true },
    });

    const now = new Date().getTime();
    const aging = {
      under30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
    };

    unpaidInvoices.forEach((inv) => {
      const bal = parseFloat(inv.balance_amount.toString() || '0');
      if (bal <= 0) return;
      const daysOld = Math.floor((now - new Date(inv.invoice_date).getTime()) / (1000 * 3600 * 24));
      if (daysOld < 30) aging.under30 += bal;
      else if (daysOld < 60) aging.days30to60 += bal;
      else if (daysOld < 90) aging.days60to90 += bal;
      else aging.over90 += bal;
    });

    const trendArray = Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const paymentDistribution = Object.entries(paymentMethodMap).map(([name, value]) => ({ name, value }));
    const statusBreakdown = Object.entries(invoiceStatusCount).map(([status, val]) => ({
      status,
      count: val.count,
      amount: val.total,
    }));

    return {
      kpi: {
        totalBilled: parseFloat(totalBilled.toFixed(2)),
        totalCollected: parseFloat(totalCollected.toFixed(2)),
        collectionRate: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100,
        totalOutstanding: parseFloat(totalOutstanding.toFixed(2)),
        invoiceCount: invoices.length,
        receiptCount: receipts.length,
      },
      revenueTrend: trendArray,
      paymentMethods: paymentDistribution,
      invoiceStatuses: statusBreakdown,
      arAging: [
        { bucket: '0 - 30 Days', amount: parseFloat(aging.under30.toFixed(2)) },
        { bucket: '31 - 60 Days', amount: parseFloat(aging.days30to60.toFixed(2)) },
        { bucket: '61 - 90 Days', amount: parseFloat(aging.days60to90.toFixed(2)) },
        { bucket: '90+ Days', amount: parseFloat(aging.over90.toFixed(2)) },
      ],
      recentTransactions: invoices.slice(-10).map((inv) => ({
        id: inv.invoice_id,
        number: inv.invoice_number,
        patientName: `${inv.patient.firstName} ${inv.patient.lastName}`,
        mrn: inv.patient.mrn,
        date: inv.invoice_date,
        amount: parseFloat(inv.net_total.toString()),
        balance: parseFloat(inv.balance_amount.toString()),
        status: inv.status,
      })),
    };
  }

  /**
   * 2. Clinical & Outcomes Report Suite
   */
  async getClinicalReport(params: ReportFilterParams) {
    const { start, end } = this.buildDateRange(params.dateFrom, params.dateTo);

    const visitWhere: Prisma.VisitWhereInput = {
      visit_date: { gte: start, lte: end },
      status: 1,
      deletedAt: null,
    };
    if (params.doctor_id) visitWhere.doctor_id = params.doctor_id;

    const visits = await prisma.visit.findMany({
      where: visitWhere,
      select: { visit_type: true, reason_for_visit: true, visit_date: true },
    });

    const visitTypesMap: Record<string, number> = {};
    const visitDateMap = new Map<string, number>();
    visits.forEach((v) => {
      const vt = v.visit_type || 'General Consultation';
      visitTypesMap[vt] = (visitTypesMap[vt] || 0) + 1;

      const dateStr = v.visit_date.toISOString().split('T')[0];
      visitDateMap.set(dateStr, (visitDateMap.get(dateStr) || 0) + 1);
    });

    // Prescriptions trend
    const prescriptions = await prisma.prescription.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: 1,
        deletedAt: null,
        ...(params.doctor_id ? { doctor_id: params.doctor_id } : {}),
      },
      select: { drug_name: true, drug_type: true, quantity: true },
    });

    const topDrugsMap: Record<string, { count: number; type: string }> = {};
    prescriptions.forEach((p) => {
      const name = p.drug_name || 'Unnamed Drug';
      if (!topDrugsMap[name]) topDrugsMap[name] = { count: 0, type: p.drug_type || 'Medicine' };
      topDrugsMap[name].count += 1;
    });

    const topDrugs = Object.entries(topDrugsMap)
      .map(([name, val]) => ({ name, type: val.type, count: val.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Allergies Prevalence
    const allergies = await prisma.patientAllergy.findMany({
      where: { status: 1, deletedAt: null },
      select: { allergyName: true },
    });
    const allergyMap: Record<string, number> = {};
    allergies.forEach((a) => {
      const name = a.allergyName || 'Unspecified';
      allergyMap[name] = (allergyMap[name] || 0) + 1;
    });
    const topAllergies = Object.entries(allergyMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Vitals Averages (BMI & Blood Pressure monitoring)
    const vitals = await prisma.patientVital.findMany({
      where: {
        vital_date: { gte: start, lte: end },
        status: 1,
        deletedAt: null,
      },
      select: { vital_date: true, bmi: true, bp_systolic: true, bp_diastolic: true },
      orderBy: { vital_date: 'asc' },
    });

    const vitalsTrendMap = new Map<string, { count: number; bmiSum: number; sysSum: number; diaSum: number }>();
    vitals.forEach((v) => {
      const ds = v.vital_date.toISOString().split('T')[0];
      const entry = vitalsTrendMap.get(ds) || { count: 0, bmiSum: 0, sysSum: 0, diaSum: 0 };
      entry.count += 1;
      if (v.bmi) entry.bmiSum += parseFloat(v.bmi.toString());
      if (v.bp_systolic) entry.sysSum += v.bp_systolic;
      if (v.bp_diastolic) entry.diaSum += v.bp_diastolic;
      vitalsTrendMap.set(ds, entry);
    });

    const vitalsTrend = Array.from(vitalsTrendMap.entries()).map(([date, val]) => ({
      date,
      avgBmi: val.count > 0 ? parseFloat((val.bmiSum / val.count).toFixed(1)) : null,
      avgSystolic: val.count > 0 ? Math.round(val.sysSum / val.count) : null,
      avgDiastolic: val.count > 0 ? Math.round(val.diaSum / val.count) : null,
    }));

    return {
      kpi: {
        totalEncounters: visits.length,
        prescriptionsIssued: prescriptions.length,
        vitalsRecorded: vitals.length,
        uniqueAllergyProfiles: Object.keys(allergyMap).length,
      },
      visitTypes: Object.entries(visitTypesMap).map(([name, value]) => ({ name, value })),
      visitTrend: Array.from(visitDateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      topDrugs,
      topAllergies,
      vitalsTrend,
    };
  }

  /**
   * 3. Operational & Practice Efficiency Suite
   */
  async getOperationalReport(params: ReportFilterParams) {
    const { start, end } = this.buildDateRange(params.dateFrom, params.dateTo);

    const appointments = await prisma.appointment.findMany({
      where: {
        appointment_date: { gte: start, lte: end },
        ...(params.doctor_id ? { doctor_id: params.doctor_id } : {}),
      },
      select: {
        appointment_status: true,
        appointment_date: true,
        start_time: true,
        doctor_firstName: true,
        doctor_lastName: true,
        doctor_specialty: true,
        cancellation_reason: true,
      },
    });

    const funnel: Record<string, number> = {
      SCHEDULED: 0,
      CONFIRMED: 0,
      'CHECKED-IN': 0,
      'WITH DOCTOR': 0,
      'CHECKED-OUT': 0,
      CANCELLED: 0,
      'NO-SHOW': 0,
    };

    const doctorStats: Record<string, { name: string; specialty: string; total: number; completed: number; noShow: number }> = {};
    const cancellationReasons: Record<string, number> = {};
    const hourlyDistribution: Record<string, number> = {};

    appointments.forEach((app) => {
      const st = (app.appointment_status || 'SCHEDULED').toUpperCase();
      funnel[st] = (funnel[st] || 0) + 1;

      // Doctor utilization
      const docKey = `${app.doctor_firstName} ${app.doctor_lastName}`;
      if (!doctorStats[docKey]) {
        doctorStats[docKey] = {
          name: `Dr. ${app.doctor_firstName || ''} ${app.doctor_lastName || ''}`.trim(),
          specialty: app.doctor_specialty || 'General',
          total: 0,
          completed: 0,
          noShow: 0,
        };
      }
      doctorStats[docKey].total += 1;
      if (st === 'CHECKED-OUT' || st === 'COMPLETED') doctorStats[docKey].completed += 1;
      if (st === 'NO-SHOW' || st === 'CANCELLED') doctorStats[docKey].noShow += 1;

      // Cancellation reasons
      if (st === 'CANCELLED' && app.cancellation_reason) {
        const r = app.cancellation_reason.trim();
        cancellationReasons[r] = (cancellationReasons[r] || 0) + 1;
      }

      // Hourly peak breakdown
      if (app.start_time) {
        const hour = new Date(app.start_time).getHours();
        const label = `${hour}:00 - ${hour + 1}:00`;
        hourlyDistribution[label] = (hourlyDistribution[label] || 0) + 1;
      }
    });

    const docList = Object.values(doctorStats).sort((a, b) => b.total - a.total);
    const cancelList = Object.entries(cancellationReasons)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);

    const totalScheduled = appointments.length;
    const fulfilled = (funnel['CHECKED-OUT'] || 0) + (funnel['COMPLETED'] || 0) + (funnel['CHECKED-IN'] || 0) + (funnel['WITH DOCTOR'] || 0);
    const noShows = (funnel['NO-SHOW'] || 0) + (funnel['CANCELLED'] || 0);

    return {
      kpi: {
        totalAppointments: totalScheduled,
        fulfillmentRate: totalScheduled > 0 ? Math.round((fulfilled / totalScheduled) * 100) : 100,
        noShowRate: totalScheduled > 0 ? Math.round((noShows / totalScheduled) * 100) : 0,
        activeProviders: docList.length,
      },
      funnel: [
        { stage: 'Booked / Confirmed', count: (funnel['SCHEDULED'] || 0) + (funnel['CONFIRMED'] || 0) },
        { stage: 'Checked-In & Waiting', count: funnel['CHECKED-IN'] || 0 },
        { stage: 'With Doctor / In-Progress', count: funnel['WITH DOCTOR'] || 0 },
        { stage: 'Completed / Checked-Out', count: funnel['CHECKED-OUT'] || 0 },
        { stage: 'Cancelled / No-Show', count: noShows },
      ],
      doctorUtilization: docList,
      cancellationReasons: cancelList,
      hourlyActivity: Object.entries(hourlyDistribution)
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => parseInt(a.hour) - parseInt(b.hour)),
    };
  }

  /**
   * 4. Patient Demographics & Growth Suite
   */
  async getDemographicsReport(params: ReportFilterParams) {
    const { start, end } = this.buildDateRange(params.dateFrom, params.dateTo);

    const patients = await prisma.patient.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        activeStatus: 1,
        ...(params.gender ? { gender: { equals: params.gender, mode: 'insensitive' } } : {}),
        ...(params.city ? { city: { contains: params.city, mode: 'insensitive' } } : {}),
      },
      select: { gender: true, age: true, dateOfBirth: true, city: true, referalSource: true, createdAt: true },
    });

    const genderMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};
    const referralMap: Record<string, number> = {};
    const ageBuckets = {
      pediatric: 0, // < 18
      youngAdult: 0, // 18-35
      adult: 0, // 36-50
      senior: 0, // 51-65
      elderly: 0, // 65+
    };
    const growthMap = new Map<string, number>();

    const nowYear = new Date().getFullYear();

    patients.forEach((p) => {
      // Gender
      const g = p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase() : 'Unspecified';
      genderMap[g] = (genderMap[g] || 0) + 1;

      // City
      const c = p.city ? p.city.trim() : 'Unknown City';
      cityMap[c] = (cityMap[c] || 0) + 1;

      // Referral
      const ref = p.referalSource || 'Direct / Walk-In';
      referralMap[ref] = (referralMap[ref] || 0) + 1;

      // Age calculation
      let calculatedAge = p.age;
      if (!calculatedAge && p.dateOfBirth) {
        calculatedAge = nowYear - new Date(p.dateOfBirth).getFullYear();
      }
      if (calculatedAge != null) {
        if (calculatedAge < 18) ageBuckets.pediatric++;
        else if (calculatedAge <= 35) ageBuckets.youngAdult++;
        else if (calculatedAge <= 50) ageBuckets.adult++;
        else if (calculatedAge <= 65) ageBuckets.senior++;
        else ageBuckets.elderly++;
      }

      // Monthly registration growth
      const mStr = p.createdAt.toISOString().slice(0, 7); // YYYY-MM
      growthMap.set(mStr, (growthMap.get(mStr) || 0) + 1);
    });

    const topCities = Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const referralDistribution = Object.entries(referralMap)
      .map(([source, count]) => ({ name: source, value: count }))
      .sort((a, b) => b.value - a.value);

    return {
      kpi: {
        newPatients: patients.length,
        topCity: topCities.length > 0 ? topCities[0].city : 'N/A',
        mostCommonReferral: referralDistribution.length > 0 ? referralDistribution[0].name : 'Walk-in',
      },
      genderSplit: Object.entries(genderMap).map(([name, value]) => ({ name, value })),
      ageDistribution: [
        { cohort: 'Pediatric (<18 yrs)', count: ageBuckets.pediatric },
        { cohort: 'Young Adult (18-35 yrs)', count: ageBuckets.youngAdult },
        { cohort: 'Adult (36-50 yrs)', count: ageBuckets.adult },
        { cohort: 'Senior (51-65 yrs)', count: ageBuckets.senior },
        { cohort: 'Elderly (65+ yrs)', count: ageBuckets.elderly },
      ],
      topCities,
      referralSources: referralDistribution,
      patientGrowth: Array.from(growthMap.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month)),
    };
  }

  /**
   * 5. Dynamic Data Explorer & Preset Builder (Custom Reports)
   */
  async getCustomReport(body: {
    dataSource: 'invoices' | 'appointments' | 'visits' | 'patients' | 'receipts';
    dateFrom?: Date;
    dateTo?: Date;
    filters?: Record<string, any>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
  }) {
    const { start, end } = this.buildDateRange(body.dateFrom, body.dateTo);
    const skip = (body.page - 1) * body.limit;
    const take = body.limit;
    const order = { [body.sortBy]: body.sortOrder };

    let data: any[] = [];
    let totalCount = 0;
    let columns: Array<{ key: string; header: string }> = [];

    switch (body.dataSource) {
      case 'invoices':
        columns = [
          { key: 'invoice_number', header: 'Invoice #' },
          { key: 'patientName', header: 'Patient Name' },
          { key: 'mrn', header: 'MRN' },
          { key: 'invoice_date', header: 'Date' },
          { key: 'net_total', header: 'Net Amount ($)' },
          { key: 'balance_amount', header: 'Balance ($)' },
          { key: 'status', header: 'Status' },
        ];
        totalCount = await prisma.invoice.count({
          where: { invoice_date: { gte: start, lte: end }, deletedAt: null, ...body.filters },
        });
        const invs = await prisma.invoice.findMany({
          where: { invoice_date: { gte: start, lte: end }, deletedAt: null, ...body.filters },
          include: { patient: { select: { firstName: true, lastName: true, mrn: true } } },
          skip,
          take,
          orderBy: order,
        });
        data = invs.map((i) => ({
          ...i,
          patientName: `${i.patient.firstName} ${i.patient.lastName}`,
          mrn: i.patient.mrn,
          net_total: parseFloat(i.net_total.toString()),
          balance_amount: parseFloat(i.balance_amount.toString()),
        }));
        break;

      case 'appointments':
        columns = [
          { key: 'appointment_id', header: 'Appt ID' },
          { key: 'patientName', header: 'Patient Name' },
          { key: 'patient_mrn', header: 'MRN' },
          { key: 'doctorName', header: 'Doctor' },
          { key: 'appointment_date', header: 'Date' },
          { key: 'appointment_type', header: 'Type' },
          { key: 'appointment_status', header: 'Status' },
        ];
        totalCount = await prisma.appointment.count({
          where: { appointment_date: { gte: start, lte: end }, ...body.filters },
        });
        const appts = await prisma.appointment.findMany({
          where: { appointment_date: { gte: start, lte: end }, ...body.filters },
          skip,
          take,
          orderBy: { appointment_date: body.sortOrder },
        });
        data = appts.map((a) => ({
          ...a,
          patientName: `${a.patient_firstName || ''} ${a.patient_lastName || ''}`.trim(),
          doctorName: `Dr. ${a.doctor_firstName || ''} ${a.doctor_lastName || ''}`.trim(),
        }));
        break;

      case 'patients':
        columns = [
          { key: 'mrn', header: 'MRN' },
          { key: 'fullName', header: 'Patient Name' },
          { key: 'gender', header: 'Gender' },
          { key: 'mobileNumber', header: 'Mobile' },
          { key: 'city', header: 'City' },
          { key: 'createdAt', header: 'Registered On' },
        ];
        totalCount = await prisma.patient.count({
          where: { createdAt: { gte: start, lte: end }, activeStatus: 1, ...body.filters },
        });
        const pts = await prisma.patient.findMany({
          where: { createdAt: { gte: start, lte: end }, activeStatus: 1, ...body.filters },
          skip,
          take,
          orderBy: { createdAt: body.sortOrder },
        });
        data = pts.map((p) => ({
          ...p,
          fullName: `${p.title || ''} ${p.firstName} ${p.lastName}`.trim(),
        }));
        break;

      case 'visits':
        columns = [
          { key: 'visit_id', header: 'Visit ID' },
          { key: 'patient_id', header: 'Patient ID' },
          { key: 'visit_type', header: 'Visit Type' },
          { key: 'doctor_id', header: 'Doctor ID' },
          { key: 'visit_date', header: 'Encounter Date' },
          { key: 'reason_for_visit', header: 'Reason / Complaint' },
        ];
        totalCount = await prisma.visit.count({
          where: { visit_date: { gte: start, lte: end }, status: 1, ...body.filters },
        });
        data = await prisma.visit.findMany({
          where: { visit_date: { gte: start, lte: end }, status: 1, ...body.filters },
          skip,
          take,
          orderBy: { visit_date: body.sortOrder },
        });
        break;

      default:
        break;
    }

    return {
      dataSource: body.dataSource,
      columns,
      data,
      pagination: {
        page: body.page,
        limit: body.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / body.limit),
      },
    };
  }

  /**
   * 6. Futuristic Conversational AI BI Engine (Text-to-Insights)
   */
  async generateAiInsight(query: string) {
    const q = query.toLowerCase();

    // Natural Language Pattern Matching for automated BI report generation
    if (q.includes('revenue') || q.includes('billing') || q.includes('invoice') || q.includes('unpaid') || q.includes('collect') || q.includes('money')) {
      const fin = await this.getFinancialReport({});
      return {
        query,
        aiResponse: `Based on real-time financial registers, your total billed revenue is **$${fin.kpi.totalBilled.toLocaleString()}** across ${fin.kpi.invoiceCount} invoices, with an overall collection rate of **${fin.kpi.collectionRate}%** ($${fin.kpi.totalCollected.toLocaleString()} received). currently, there is **$${fin.kpi.totalOutstanding.toLocaleString()}** in outstanding balance, of which **$${fin.arAging[0].amount.toLocaleString()}** falls under the 30-day bucket.`,
        recommendedCategory: 'financial',
        data: fin,
      };
    }

    if (q.includes('doctor') || q.includes('appointment') || q.includes('show') || q.includes('cancel') || q.includes('schedule')) {
      const ops = await this.getOperationalReport({});
      const topDoc = ops.doctorUtilization.length > 0 ? ops.doctorUtilization[0] : null;
      return {
        query,
        aiResponse: `Regarding practice operations: We recorded **${ops.kpi.totalAppointments} scheduled encounters** with an overall fulfillment rate of **${ops.kpi.fulfillmentRate}%**. The clinic's cancellation/no-show rate stands at **${ops.kpi.noShowRate}%**. ${topDoc ? `Your most active provider is **${topDoc.name}** (${topDoc.specialty}) with **${topDoc.total} total visits**.` : ''}`,
        recommendedCategory: 'operational',
        data: ops,
      };
    }

    if (q.includes('drug') || q.includes('prescription') || q.includes('allergy') || q.includes('clinical') || q.includes('diagnosis') || q.includes('vital')) {
      const clin = await this.getClinicalReport({});
      const topDrug = clin.topDrugs.length > 0 ? clin.topDrugs[0].name : 'General Medication';
      return {
        query,
        aiResponse: `Clinical surveillance summary: Over recent visits, **${clin.kpi.totalEncounters} clinical encounters** generated **${clin.kpi.prescriptionsIssued} prescriptions**. The most frequently prescribed pharmaceutical is **${topDrug}**. We are also tracking **${clin.kpi.uniqueAllergyProfiles} distinct patient allergy profiles** across our master database.`,
        recommendedCategory: 'clinical',
        data: clin,
      };
    }

    // Default to demographics and growth
    const demo = await this.getDemographicsReport({});
    return {
      query,
      aiResponse: `Patient population overview: You have registered **${demo.kpi.newPatients} active patients**. The leading geographic pool is from **${demo.kpi.topCity}** and your leading patient acquisition channel is **${demo.kpi.mostCommonReferral}**.`,
      recommendedCategory: 'demographics',
      data: demo,
    };
  }
}
