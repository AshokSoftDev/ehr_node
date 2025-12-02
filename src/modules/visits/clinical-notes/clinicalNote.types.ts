export type NotesType = 'text' | 'audio';

export interface CreateClinicalNoteDto {
  notes_type: NotesType;
  editor_notes?: string;
}

export interface UpdateClinicalNoteDto {
  editor_notes: string;
}
