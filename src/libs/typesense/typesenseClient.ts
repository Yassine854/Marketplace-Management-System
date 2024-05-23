import typesense from "typesense";

export const typesenseClient = new typesense.Client({
  nodes: [
    {
      host: String(process.env.NEXT_PUBLIC_TYPESENSE_HOST),
      port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT),
      protocol: String(process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL),
    },
  ],
  apiKey: String(process.env.NEXT_PUBLIC_TYPESENSE_KEY),
  connectionTimeoutSeconds: 5,
});
