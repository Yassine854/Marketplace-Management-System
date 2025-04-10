export interface TypePartner {
  id: string;
  name: string;
}

export interface Partner {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address: string;
  password: string;
  roleId: string;
  isActive: boolean;
  logo?: string;
  patent?: string;
  responsibleName: string;
  position: string;
  coverageArea: string;
  minimumAmount: number;
  typePartnerId: string;
  typePartner: TypePartner;
  createdAt: Date;
  updatedAt: Date;
}
