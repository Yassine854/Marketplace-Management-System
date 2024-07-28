import { useAuth } from "@/features/shared/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

const TanstackQueryProvider = ({ children }: any) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      queryClient.clear();
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
