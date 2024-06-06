import { useParams, useRouter } from "next/navigation";

export const useNavigation = () => {
  const { back, push } = useRouter();
  const { status, locale } = useParams();

  const navigateBack = () => {
    back();
  };

  const navigateToOrderDetails = () => {
    push("/order-details");
  };
  const navigateToLogin = () => {
    push("/login");
  };

  const navigateToDashboard = () => {
    push("/dashboard");
  };

  const navigateToUsersTable = () => {
    push("/access/users");
  };

  const navigateToCreateUserForm = () => {
    push("/access/create-user");
  };
  return {
    navigateBack,
    navigateToOrderDetails,
    navigateToDashboard,
    navigateToUsersTable,
    navigateToLogin,
    navigateToCreateUserForm,
    status: String(status),
    locale: String(locale),
  };
};
