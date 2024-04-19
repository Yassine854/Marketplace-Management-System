"use client";

import { gql, useQuery } from "@apollo/client";

import OrdersTable from "@/components/blocks/OrdersTable";
import { useEffect } from "react";

const QUERY = gql`
  query GetOpenOrders($status: String!, $page: Int!, $perPage: Int!) {
    getOrders(status: $status, page: $page, perPage: $perPage) {
      orders {
        id
        deliveryDate
        customer {
          id
          name
        }
      }
      total
    }
  }
`;

const OpenOrdersPage = () => {
  const { data, loading } = useQuery(QUERY, {
    variables: {
      status: "open",
      page: 1,
      perPage: 10,
    },
  });

  useEffect(() => {
    console.log("🚀 ~ OpenOrdersPage ~ data:", data);
  }, [data]);

  return (
    <div className="h-full w-full">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrdersTable
          orders={data?.getOrders.orders}
          total={data?.getOrders.total}
        />
      )}
    </div>
  );
};

export default OpenOrdersPage;
