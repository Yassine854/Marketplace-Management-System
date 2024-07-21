export const logError = (error: unknown): void => {
  if (process.env.NODE_ENV) {
    console.error("Error Log :  ");
    console.error(error);
  }
};
