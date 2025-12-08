export interface CreateDocumentTypeDto {
  type_name: string;
  description?: string;
}

export type UpdateDocumentTypeDto = Partial<CreateDocumentTypeDto> & {
  status?: number;
};

export interface DocumentTypeFilters {
  search?: string;
  status?: number;
}
