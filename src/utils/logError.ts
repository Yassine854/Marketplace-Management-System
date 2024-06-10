export const logError = (error: string): void => {
  process.env.NODE_ENV === "development" && console.error(error);
};
