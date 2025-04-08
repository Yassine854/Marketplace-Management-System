export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address?: string | null;
  password?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  roleId: string;
  favoriteProducts?: any[];
  favoritePartners?: any[];
  orders?: any[];
  reservations?: any[];
  notifications?: any[];
}
