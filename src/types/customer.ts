export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  address?: string;
  governorate?: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
