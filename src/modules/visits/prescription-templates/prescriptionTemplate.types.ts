export interface CreatePrescriptionTemplateDto {
  template_id: number;
  template_name: string;
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

export interface UpdatePrescriptionTemplateDto {
  template_name?: string;
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

export interface BulkCreatePrescriptionTemplateDto {
  templates: CreatePrescriptionTemplateDto[];
}
