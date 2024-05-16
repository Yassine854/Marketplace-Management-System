import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const typesenseOrdersCollectionSchema: CollectionCreateSchema = {
  name: "orders",
  enable_nested_fields: true,
  default_sorting_field: "createdAt",
  fields: [
    {
      name: "id",
      type: "string",
    },
    {
      name: "kamiounId",
      type: "string",
    },
    {
      name: "state",
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
      name: "createdAt",
      type: "int64",
    },
    {
      name: "customerId",
      type: "string",
    },
    {
      name: "customerFirstname",
      type: "string",
    },
    {
      name: "customerLastname",
      type: "string",
    },
    {
      name: "deliveryAgentId",
      type: "string",
    },
    {
      name: "deliveryAgent",
      type: "string",
    },
    {
      name: "deliveryDate",
      type: "int64",
    },
    {
      name: "source",
      type: "string",
    },

    {
      name: "lines",
      type: "auto",
    },
  ],
};
