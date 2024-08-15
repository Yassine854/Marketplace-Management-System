export type AuditLogRequestBody = {
  username: string;
  userId: string;
  action: string;
  actionTime: Date;
  orderId: string;
};
