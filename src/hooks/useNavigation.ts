import { useRouter } from "next/navigation";

export const useNavigation = () => {
  const { back, push } = useRouter();

  const navigateBack = () => {
    back();
  };

  return { navigateBack };
};
