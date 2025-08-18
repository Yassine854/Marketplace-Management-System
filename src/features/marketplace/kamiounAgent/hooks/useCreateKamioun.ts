import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export type CreateUserPayload = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
  mRoleId?: string;
};

export function useCreateKamiounAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (payload: CreateUserPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post("/api/users/createUser", payload);
      toast.success("User created successfully!");
      return true;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to create user";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
}
