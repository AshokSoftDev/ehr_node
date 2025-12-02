import { Prisma, ClinicalNotes } from '@prisma/client';
import { prisma } from '../../../utils/prisma';

export class ClinicalNoteRepository {
  findVisitById(visitId: number) {
    return prisma.visit.findUnique({
      where: { visit_id: visitId },
      select: {
        visit_id: true,
        patient_id: true,
        appointment_id: true,
        location_id: true,
        doctor_id: true,
        status: true,
      },
    });
  }

  create(data: Prisma.ClinicalNotesUncheckedCreateInput): Promise<ClinicalNotes> {
    return prisma.clinicalNotes.create({ data });
  }

  listByVisit(visitId: number): Promise<ClinicalNotes[]> {
    return prisma.clinicalNotes.findMany({
      where: { visit_id: visitId, status: 1 },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(noteId: number): Promise<ClinicalNotes | null> {
    return prisma.clinicalNotes.findUnique({
      where: { cn_id: noteId },
    });
  }

  update(noteId: number, data: Prisma.ClinicalNotesUncheckedUpdateInput): Promise<ClinicalNotes> {
    return prisma.clinicalNotes.update({
      where: { cn_id: noteId },
      data,
    });
  }
}
