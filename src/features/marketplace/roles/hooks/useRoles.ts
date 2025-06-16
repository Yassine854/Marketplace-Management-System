import { useQuery } from "@tanstack/react-query";
import { Role } from "@/types/role";
import axios from "axios";

export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data } = await axios.get("/api/marketplace/roles/getAll");
      return data;
    },
  });
}
