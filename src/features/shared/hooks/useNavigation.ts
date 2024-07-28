import { useParams, useRouter } from "next/navigation";

export const useNavigation = () => {
  const { back, push } = useRouter();
  const { locale } = useParams();

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

  const navigateToOrders = () => {
    push("/orders");
  };

  const navigateToUsersTable = () => {
    push("/access/users");
  };

  const navigateToCreateUserForm = () => {
    push("/access/create-user");
  };

  const navigateToEditUserForm = () => {
    push("/access/edit-user");
  };

  const navigateToManageMilkRun = () => {
    push("/milk-run");
  };

  return {
    navigateBack,
    navigateToLogin,
    navigateToOrders,
    navigateToDashboard,
    navigateToUsersTable,
    navigateToOrderDetails,
    locale: String(locale),
    navigateToEditUserForm,
    navigateToManageMilkRun,
    navigateToCreateUserForm,
  };
};
