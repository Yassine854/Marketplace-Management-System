export type AuditLog = {
  username: string | undefined;
  userId: string | undefined;
  action: string;
  actionTime: Date;
  orderId: string;
};
