export interface PmhPayload {
  conditionName: string;
  notes?: string | null;
  status?: number;
}

export type PmhUpdatePayload = Partial<PmhPayload>;
