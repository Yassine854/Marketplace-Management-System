import { useParams, useRouter } from "next/navigation";

import { Params } from "./queries/useGetOrdersCount";
import { useEffect } from "react";

export const useNavigation = () => {
  const { back, push } = useRouter();
  const { status, locale } = useParams();

  const navigateBack = () => {
    back();
  };

  const navigateToOrderDetails = (orderId: string) => {
    push("/order/" + orderId);
  };

  return {
    navigateBack,
    status: String(status),
    locale: String(locale),
    navigateToOrderDetails,
  };
};
