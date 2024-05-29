export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  password: string;
  status: string;
  roleId: string;
  warehouseId: string;
};
