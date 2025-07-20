import { Context, GrowthBook } from "@growthbook/growthbook-react";

export const getGBClient = (context?: Context) => {
  return new GrowthBook({
    ...context,
    apiHost: process.env.NEXT_PUBLIC_GB_HOST,
    clientKey: process.env.NEXT_PUBLIC_GB_KEY,
    enableDevMode: true,
  });
};
