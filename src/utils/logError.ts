export const logError = (error: unknown): void => {
  process.env.NODE_ENV === "development" && console.error(error);
};
