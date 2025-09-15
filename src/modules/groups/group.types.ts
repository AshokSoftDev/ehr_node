export interface CreateGroupDto {
    name: string;
    description?: string;
    permissions?: {
        moduleId: string;
        hasAccess: boolean;
        subModules?: {
            subModuleId: string;
            allowed: boolean;
        }[];
    }[];
}

export interface UpdateGroupDto {
    name?: string;
    description?: string;
    permissions?: {
        moduleId: string;
        hasAccess: boolean;
        subModules?: {
            subModuleId: string;
            allowed: boolean;
        }[];
    }[];
}

export interface GroupFilters {
    search?: string;
}

export interface GroupWithCounts {
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
}

export interface GroupWithPermissions extends GroupWithCounts {
    permissions?: any[];
}
