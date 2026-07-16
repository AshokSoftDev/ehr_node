import { AppointmentRepository } from '../src/modules/appointments/appointment.repository';
import { prisma } from '../src/utils/prisma';

async function run() {
  const repo = new AppointmentRepository();
  const allAppts = await prisma.appointment.findMany({ select: { doctor_id: true } });
  console.log("Unique doctor IDs with appointments:", [...new Set(allAppts.map(a => a.doctor_id))]);
  
  const doctors = await repo.getDoctors();
  console.log("All doctors:", doctors.map(d => ({ id: d.id, name: d.displayName })));
  process.exit(0);
}
run().catch(console.error);
