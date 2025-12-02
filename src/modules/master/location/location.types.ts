export interface CreateLocationDto {
  location_name: string;
  address?: string;
  city: string;
  state: string;
}

export type UpdateLocationDto = Partial<CreateLocationDto> & {
  status?: number;
  active?: boolean;
};

export interface LocationFilters {
  search?: string;
}
