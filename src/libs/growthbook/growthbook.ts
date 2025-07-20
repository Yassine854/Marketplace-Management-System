import { Context, GrowthBook } from "@growthbook/growthbook";

export const getGB = (context?: Context) => {
  return new GrowthBook({
    ...context,
    apiHost: process.env.NEXT_PUBLIC_GB_HOST,
    clientKey: process.env.NEXT_PUBLIC_GB_API_KEY,
    enableDevMode: true,
  });
};
