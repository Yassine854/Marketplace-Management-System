import { gql, useQuery } from "@apollo/client";

import { ApolloError } from "@apollo/client";
import { Order } from "@/types/order";
import { useOrderDetailsStore } from "../../stores/orderDetailsStore";

export type Params = {
  status: string;
  page: number;
  perPage: number;
  sortBy: string;
  search: string;
};

type Orders = {
  orders: Order[];
  total: number;
};

type Res = {
  data: Order;
  error: ApolloError | undefined;
  isLoading: boolean;
};

const QUERY = gql`
  query GetOrder($orderId: ID!) {
    getOrder(orderId: $orderId) {
      id
      incrementId
      kamiounId
      storeId
      state
      status
      total
      createdAt
      customerId
      customerFirstname
      customerLastname
      customerPhone
      deliveryAgentId
      deliveryAgentName
      deliveryDate
      deliveryStatus
      source
      items {
        id
        orderId
        productId
        productName
        productPrice
        totalPrice
        sku
        weight
        orderedQuantity
        #  quantity
        # shipped
        # pcb
      }
    }
  }
`;

export const useGetOrder = () => {
  const { orderOnReviewId } = useOrderDetailsStore();
  const { data, loading, error, refetch } = useQuery(QUERY, {
    fetchPolicy: "network-only",
    pollInterval: 300000,
    variables: {
      orderId: orderOnReviewId,
    },
  });

  return {
    data: data?.getOrder,
    isLoading: loading,
    error,
    refetch,
  };
};
