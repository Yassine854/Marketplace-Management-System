export const ordersSchema = {
  name: "orders",
  enable_nested_fields: true,
  fields: [
    {
      name: "id",
      type: "string",
    },
    {
      name: "status",
      type: "string",
    },
    {
      name: "total",
      type: "float",
    },
    {
      name: "created_at",
      type: "int64",
    },
    {
      name: "customer_id",
      type: "string",
    },
    {
      name: "customer_firstname",
      type: "string",
    },
    {
      name: "customer_lastname",
      type: "string",
    },
    {
      name: "delivery_agent_id",
      type: "string",
    },
    {
      name: "delivery_agent",
      type: "string",
    },
    {
      name: "delivery_date",
      type: "int64",
    },
    {
      name: "verified",
      type: "bool",
    },
    {
      name: "from_mobile",
      type: "bool",
    },
    {
      name: "items",
      type: "auto",
    },
  ],
};
