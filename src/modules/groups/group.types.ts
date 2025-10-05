export interface GroupFilters {
    search?: string;
    page?: number;
    limit?: number;
  }
  
  export interface CreateGroupDto {
    name: string;
    description?: string;
    permissions: Array<{
      moduleId: string;
      hasAccess: boolean;
      subModules: Array<{
        subModuleId: string;
        allowed: boolean;
      }>;
    }>;
  }
  
  export interface UpdateGroupDto extends CreateGroupDto {
    id: string;
  }
  
  export interface GroupResponse {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    createdBy?: string | null;
    updatedAt: Date;
    updatedBy?: string | null;
    _count?: {
      users: number;
      permissions: number;
    };
    permissions?: Array<{
      moduleId: string;
      hasAccess: boolean;
      module?: {
        id: string;
        name: string;
        description?: string | null;
        subModules?: Array<{
          id: string;
          name: string;
          description?: string | null;
        }>;
      };
      subModulePermissions?: Array<{
        subModule: {
          id: string;
          name: string;
          description?: string | null;
        };
        allowed: boolean;
      }>;
    }>;
  }
  
  export interface GroupListResponse {
    groups: GroupResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  