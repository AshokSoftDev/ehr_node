export interface CreatePrescriptionDto {
  drug_id?: number;
  drug_name: string;
  drug_generic?: string;
  drug_type?: string;
  drug_dosage?: string;
  drug_measure?: string;
  instruction?: string;
  duration?: number;
  duration_type?: string;
  quantity?: number;
  morning_bf?: boolean;
  morning_af?: boolean;
  noon_bf?: boolean;
  noon_af?: boolean;
  evening_bf?: boolean;
  evening_af?: boolean;
  night_bf?: boolean;
  night_af?: boolean;
  notes?: string;
}

export interface UpdatePrescriptionDto {
  drug_id?: number;
  drug_name?: string;
  drug_generic?: string;
  drug_type?: string;
  drug_dosage?: string;
  drug_measure?: string;
  instruction?: string;
  duration?: number;
  duration_type?: string;
  quantity?: number;
  morning_bf?: boolean;
  morning_af?: boolean;
  noon_bf?: boolean;
  noon_af?: boolean;
  evening_bf?: boolean;
  evening_af?: boolean;
  night_bf?: boolean;
  night_af?: boolean;
  notes?: string;
}

// Bulk create DTO for multiple prescriptions
export interface BulkCreatePrescriptionDto {
  prescriptions: CreatePrescriptionDto[];
}

// Bulk update DTO - includes prescription_id for each item
export interface BulkUpdatePrescriptionItem extends UpdatePrescriptionDto {
  prescription_id: number;
}

export interface BulkUpdatePrescriptionDto {
  prescriptions: BulkUpdatePrescriptionItem[];
}

// Bulk delete DTO
export interface BulkDeletePrescriptionDto {
  prescriptionIds: number[];
}
