// DTOs for VisitDocument
export interface CreateDocumentDto {
  file_name: string;
  document_type_id: number;
  file_path: string;
  description?: string;
  mime_type: string;
  file_size: number;
}

export interface UpdateDocumentDto {
  file_name?: string;
  document_type_id?: number;
  description?: string;
}

export interface DocumentListParams {
  visitId: number;
  status?: number;
}
