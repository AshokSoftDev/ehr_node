export interface CreateSurgeryDto {
  surgeryName: string;
  notes?: string;
  status?: number;
}

export type UpdateSurgeryDto = Partial<CreateSurgeryDto>;
