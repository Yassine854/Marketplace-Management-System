import { OrderLine } from "@/types/OrderLine";
import { getOrderLines } from "./index"; // Adjust the path as needed

describe("getOrderLines", () => {
  test("converts order items correctly", () => {
    expect(getOrderLines(orderItems)).toEqual(expectedOrderLines);
  });

  test("returns an empty array when orderItems is undefined", () => {
    expect(getOrderLines(undefined)).toEqual([]);
  });

  test("returns an empty array when orderItems is null", () => {
    expect(getOrderLines(null)).toEqual([]);
  });

  test("returns an empty array when orderItems is an empty array", () => {
    expect(getOrderLines([])).toEqual([]);
  });
});

const orderItems = [
  {
    item_id: "1",
    order_id: "100",
    product_id: "200",
    product_name: "test1",
    base_price: 10.0,
    quantity_ordered: 2,
    price: 20.0,
    sku: "ABC123",
  },
  {
    item_id: "2",
    order_id: "101",
    product_id: "201",
    product_name: "test2",
    base_price: 15.0,
    quantity_ordered: 1,
    price: 15.0,
    sku: "DEF456",
  },
];

const expectedOrderLines: OrderLine[] = [
  {
    id: "1",
    orderId: "100",
    kamiounOrderId: "",
    productId: "200",
    productName: "test1",
    productPrice: 10.0,
    quantity: 2,
    totalPrice: 20.0,
    sku: "ABC123",
  },
  {
    id: "2",
    orderId: "101",
    kamiounOrderId: "",
    productId: "201",
    productName: "test2",
    productPrice: 15.0,
    quantity: 1,
    totalPrice: 15.0,
    sku: "DEF456",
  },
];
