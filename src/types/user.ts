export type User = {
  id: string;
  username: string;
  email?: string | null;
  password: string;
  status: string;
  role: string;
  warehouses: string[];
};
