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

  // const navigateToDashboard = () => {
  //   push("/dashboard");
  // };

  const navigateToAllSuppliersDashboard = () => {
    push("/suppliers");
  };

  const navigateToSupplierDashboard = () => {
    push("/SupplierDashboard");
  };

  const navigateToOrders = () => {
    push("/orders");
  };

  const navigateToUsersTable = () => {
    push("/access/admins");
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

  const navigateToMarketplaceDashboard = () => {
    push("/marketplace/dashboard");
  };

  const navigateToPartnersDashboard = () => {
    push("/marketplace/partners/dashboard");
  };

  return {
    navigateBack,
    navigateToLogin,
    navigateToOrders,
    // navigateToDashboard,
    navigateToAllSuppliersDashboard,
    navigateToSupplierDashboard,
    navigateToUsersTable,
    navigateToOrderDetails,
    locale: String(locale),
    navigateToEditUserForm,
    navigateToManageMilkRun,
    navigateToCreateUserForm,
    navigateToMarketplaceDashboard,
    navigateToPartnersDashboard,
  };
};
