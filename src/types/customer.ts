export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  governorate: string;
  email: string;
  telephone: string;
  address: string;
  password: string;
  roleId?: string;
  isActive?: boolean;
  created_at?: Date;
  updated_at?: Date;
  // Business fields
  socialName?: string;
  fiscalId: string;
  businessType: string;
  activity1: string;
  activity2?: string;
  // Photos
  cinPhoto?: any;
  patentPhoto?: any;
}
