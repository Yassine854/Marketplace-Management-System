export const logError = (error: unknown): void => {
  console.error("Error Log :  ");
  process.env.NODE_ENV === "development" && console.error(error);
};
