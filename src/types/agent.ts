export interface Agent {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  telephone?: string;
  address?: string;
  password?: string;
  roleId?: string;
  isActive?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
