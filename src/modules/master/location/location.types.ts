export interface CreateLocationDto {
  location_name: string;
  address?: string;
  city: string;
  state: string;
}

export type UpdateLocationDto = Partial<CreateLocationDto> & {
  status?: number;
};

export interface LocationFilters {
  search?: string;
}

