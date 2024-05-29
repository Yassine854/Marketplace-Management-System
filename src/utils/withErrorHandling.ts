type AsyncFunction<T> = (...args: any[]) => Promise<T>;

export function withErrorHandling<T>(asyncFunc: AsyncFunction<T>) {
  return async (
    ...args: any[]
  ): Promise<{ data?: T; success: boolean; message: string }> => {
    try {
      const result = await asyncFunc(...args);
      const message = (result as any).message || "Operation successful";
      return { data: result, success: true, message };
    } catch (error: any) {
      process.env.NODE_ENV === "development" && console.error("Error:", error);
      return {
        data: undefined,
        success: false,
        message:
          error.message || "Failed to create user. Please try again later.",
      };
    }
  };
}
