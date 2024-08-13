export type AuditLogRequestBody = {
  username: string;
  userid: string;
  action: string;
  actionTime: Date;
  orderid: String;
};
