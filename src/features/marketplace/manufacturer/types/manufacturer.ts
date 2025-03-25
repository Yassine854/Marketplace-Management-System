// types/manufacturer.ts
export interface Manufacturer {
  id: string;
  manufacturerId: number;
  code: string;
  companyName: string;
  contactName?: string;
  phoneNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  capital?: string;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
