export const logError = (error: unknown): void => {
  console.log("logError:  ");
  process.env.NODE_ENV === "development" && console.error(error);
};
