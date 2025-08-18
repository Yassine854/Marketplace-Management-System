import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useKamiounActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const editUser = async (payload: {
    username: string;
    firstName: string;
    lastName: string;
    roleId?: string;
    mRoleId?: string;
    newPassword?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.put("/api/users/editUser", payload);
      const successMsg = "User updated successfully!";
      setSuccessMessage(successMsg);
      toast.success(successMsg);
      return true;
    } catch (err: AxiosError | any) {
      const errorMsg = err?.response?.data?.message || "Failed to edit user";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const editUserStatus = async (
    username: string,
    status: "active" | "inactive",
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.put("/api/users/editUserStatus", { username, status });
      const successMsg = "User status updated successfully!";
      setSuccessMessage(successMsg);
      toast.success(successMsg);
      return true;
    } catch (err: AxiosError | any) {
      const errorMsg =
        err?.response?.data?.message || "Failed to update user status";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { editUser, editUserStatus, isLoading, error, successMessage };
}
