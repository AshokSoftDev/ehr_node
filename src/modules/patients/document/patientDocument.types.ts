export interface CreatePatientDocumentDto {
  file_name: string;
  document_type_id: number;
  file_path: string;
  description?: string;
  mime_type: string;
  file_size: number;
}

export interface UpdatePatientDocumentDto {
  file_name?: string;
  document_type_id?: number;
  description?: string;
}
