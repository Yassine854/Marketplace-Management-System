import { User } from "@/types/user";

export type UserPayload = {
  user?: User;
  success: boolean;
  message?: string;
};

export type UsersPayload = {
  users?: User[];
  success: boolean;
  message?: string;
};
