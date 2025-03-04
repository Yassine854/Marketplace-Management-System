export interface LogContext {
  userId?: string;
  username?: string;
  storeId?: string;
  [key: string]: any;
}
export interface Log {
  id: string;
  type: string;
  message: string;
  timestamp: String;
  context: LogContext;
  dataBefore: any;
  dataAfter: any;
}
export type LogType = "info" | "error" | "warning" | "order";

export interface LogCreateInput {
  type: string;
  message: string;
  context: LogContext;
  timestamp: String;
  dataBefore?: any;
  dataAfter?: any;
}
