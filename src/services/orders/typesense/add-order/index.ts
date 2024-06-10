import { typesenseClient } from "@/libs/typesense";

export const addOrder = async () => {
  try {
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    throw new Error();
  }
};
