import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { User } from "@/types/user";

export const useGetAllKamiounAgents = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        message: string;
        users: User[];
      }>("/api/users/getAllUsers");

      setUsers(data.users || []);
    } catch (err) {
      let errorMessage = "Failed to fetch users";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    isEmpty: !isLoading && !error && users.length === 0,
  };
};
