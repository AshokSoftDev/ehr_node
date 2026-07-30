export interface CreateSocialDto {
  socialName: string;
  option1: string;
  option2: string;
  notes?: string;
  status?: number;
}

export type UpdateSocialDto = Partial<CreateSocialDto> & {
  status?: number;
};

export interface SocialFilters {
  search?: string;
}
