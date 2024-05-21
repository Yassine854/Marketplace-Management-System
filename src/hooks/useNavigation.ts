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

  const navigateToDashboard = () => {
    push("/dashboard");
  };
  return {
    navigateBack,
    navigateToOrderDetails,
    navigateToDashboard,
    status: String(status),
    locale: String(locale),
  };
};
