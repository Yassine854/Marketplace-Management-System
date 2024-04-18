"use client";

import OpenOrdersTemplate from "@/components/templates/OpenOrdersTemplate";
import { typesenseClient } from "@/libs/typesenseClient";
import { useEffect } from "react";

const searchParameters = {
  q: "ali",
  query_by: "customer_firstname",
  sort_by: "customer_id:desc",
};

const OrdersPage = () => {
  useEffect(() => {
    typesenseClient
      .collections("orders")
      .documents()
      .search(searchParameters)
      .then((res) => {
        console.log("🚀 ~ .then ~ res:", res);
      })
      .catch((err) => {
        console.log("🚀 ~ .then ~ err:", err);
      });
  }, []);

  return <OpenOrdersTemplate />;
};

export default OrdersPage;
