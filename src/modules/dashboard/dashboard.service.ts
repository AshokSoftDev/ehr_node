import { prisma } from '../../utils/prisma';
import { Prisma } from '@prisma/client';

export class DashboardService {
    
    /**
     * Helper to get start and end of a specific date in local timezone context
     */
    private getDateBounds(dateString: string) {
        // Assuming dateString is YYYY-MM-DD
        const start = new Date(`${dateString}T00:00:00.000Z`);
        const end = new Date(`${dateString}T23:59:59.999Z`);
        return { start, end };
    }

    /**
     * 1. GET /metrics
     * Returns key performance indicators for a given date (default today).
     */
    async getMetrics(dateStr: string) {
        const { start, end } = this.getDateBounds(dateStr);

        // Appointments Today
        const appointmentsCount = await prisma.appointment.count({
            where: {
                appointment_date: { gte: start, lte: end },
                status: 1
            }
        });

        // New Patients Registered Today
        const newPatientsToday = await prisma.patient.count({
            where: {
                createdAt: { gte: start, lte: end },
                activeStatus: 1
            }
        });

        // Today's Revenue (Sum of Receipts created today)
        const revenueResult = await prisma.receipt.aggregate({
            _sum: { amount: true },
            where: {
                payment_date: { gte: start, lte: end },
                status: 1
            }
        });
        const dailyRevenue = revenueResult._sum.amount || new Prisma.Decimal(0);

        // Today's Billed (Sum of Invoices created today)
        const billedResult = await prisma.invoice.aggregate({
            _sum: { net_total: true },
            where: {
                invoice_date: { gte: start, lte: end },
                status: { in: ['sent', 'paid', 'draft'] }
            }
        });
        const dailyBilled = billedResult._sum.net_total || new Prisma.Decimal(0);

        // Trend calculation strategy (basic: compare to yesterday)
        const yesterdayStart = new Date(start);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = new Date(end);
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

        const yesterdayAppointments = await prisma.appointment.count({
            where: {
                appointment_date: { gte: yesterdayStart, lte: yesterdayEnd },
                status: 1
            }
        });

        let appointmentsTrend = 0;
        if (yesterdayAppointments > 0) {
            appointmentsTrend = Math.round(((appointmentsCount - yesterdayAppointments) / yesterdayAppointments) * 100);
        } else if (appointmentsCount > 0) {
            appointmentsTrend = 100; // 100% increase if yesterday was 0
        }

        return {
            appointmentsCount,
            appointmentsTrend: appointmentsTrend > 0 ? `+${appointmentsTrend}%` : `${appointmentsTrend}%`,
            newPatientsToday,
            dailyRevenue,
            dailyBilled,
            avgWaitTimeMinutes: 15 // Placeholder for now, requires complex status timestamping to calculate real wait time
        };
    }

    /**
     * 2. GET /pipeline
     * Returns the kanban-style flow of today's patients.
     * Uses appointment status to determine stage.
     */
    async getPipeline(dateStr: string) {
        const { start, end } = this.getDateBounds(dateStr);

        // Get all appointments for the day
        const appointments = await prisma.appointment.findMany({
            where: {
                appointment_date: { gte: start, lte: end },
                status: 1
            },
            select: { appointment_status: true }
        });

        // Also check visits that might not have appointments linked
        const visits = await prisma.visit.findMany({
            where: {
                visit_date: { gte: start, lte: end },
                status: 1
            },
            include: { invoices: { select: { status: true } } }
        });

        const pipeline = {
            booked: 0,
            checkedIn: 0,
            withDoctor: 0,
            paymentPending: 0,
            completed: 0
        };

        // Categorize appointments
        appointments.forEach(app => {
            const status = app.appointment_status.toLowerCase();
            if (status === 'booked' || status === 'scheduled') pipeline.booked++;
            else if (status === 'checked-in' || status === 'waiting') pipeline.checkedIn++;
            else if (status === 'with-doctor' || status === 'in-progress') pipeline.withDoctor++;
            else if (status === 'completed' || status === 'checked-out') pipeline.completed++;
            else pipeline.booked++; // Default fallback
        });

        // We could refine paymentPending by looking at visits with unpaid invoices
        visits.forEach(visit => {
            const hasUnpaidInvoice = visit.invoices.some(inv => inv.status === 'sent' || inv.status === 'draft');
            if (hasUnpaidInvoice) {
                // If they have an unpaid invoice, they are in payment pending stage
                pipeline.paymentPending++;
                // Let's remove them from completed to aviod double counting if they are both
                if (pipeline.completed > 0) pipeline.completed--;
            }
        });

        return pipeline;
    }

    /**
     * 3. GET /schedule
     * Returns upcoming appointments for the timeline view.
     */
    async getSchedule(dateStr: string, limit: number) {
        const { start, end } = this.getDateBounds(dateStr);
        const now = new Date(); // To only show future/current appointments for today

        const schedule = await prisma.appointment.findMany({
            where: {
                appointment_date: { gte: start, lte: end },
                // start_time: { gte: now }, // Enable this if you only want STRICTLY future appointments today
                status: 1
            },
            take: limit,
            orderBy: { start_time: 'asc' },
            select: {
                appointment_id: true,
                start_time: true,
                end_time: true,
                appointment_type: true,
                appointment_status: true,
                reason_for_visit: true,
                patient_firstName: true,
                patient_lastName: true,
                patient_mrn: true,
                doctor_firstName: true,
                doctor_lastName: true,
                doctor_specialty: true,
            }
        });

        return schedule.map(app => ({
            id: app.appointment_id,
            time: app.start_time,
            endTime: app.end_time,
            patientName: `${app.patient_firstName} ${app.patient_lastName}`,
            patientMrn: app.patient_mrn,
            doctorName: `Dr. ${app.doctor_firstName} ${app.doctor_lastName}`,
            specialty: app.doctor_specialty,
            type: app.appointment_type,
            status: app.appointment_status,
            reason: app.reason_for_visit
        }));
    }

    /**
     * 4. GET /revenue-trend
     * Returns Billed vs Collected revenue aggregated by day for the last N days.
     */
    async getRevenueTrend(days: number) {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - (days - 1));
        
        // Reset times to start of day for accurate grouping
        pastDate.setUTCHours(0, 0, 0, 0);

        // Fetch Invoices (Billed)
        const invoices = await prisma.invoice.findMany({
            where: {
                invoice_date: { gte: pastDate },
                status: { in: ['sent', 'paid', 'draft'] }
            },
            select: { invoice_date: true, net_total: true }
        });

        // Fetch Receipts (Collected)
        const receipts = await prisma.receipt.findMany({
            where: {
                payment_date: { gte: pastDate },
                status: 1
            },
            select: { payment_date: true, amount: true }
        });

        // Aggregate by day string (YYYY-MM-DD)
        const trendMap = new Map<string, { date: string, billed: number, collected: number }>();

        // Initialize map with all days in range to ensure no gaps
        for (let i = 0; i < days; i++) {
            const d = new Date(pastDate);
            d.setDate(d.getDate() + i);
            const dateString = d.toISOString().split('T')[0];
            trendMap.set(dateString, { date: dateString, billed: 0, collected: 0 });
        }

        invoices.forEach(inv => {
            const dateString = inv.invoice_date.toISOString().split('T')[0];
            const entry = trendMap.get(dateString);
            if (entry) {
                entry.billed += parseFloat(inv.net_total.toString());
            }
        });

        receipts.forEach(rec => {
            const dateString = rec.payment_date.toISOString().split('T')[0];
            const entry = trendMap.get(dateString);
            if (entry) {
                entry.collected += parseFloat(rec.amount.toString());
            }
        });

        return Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }
}
