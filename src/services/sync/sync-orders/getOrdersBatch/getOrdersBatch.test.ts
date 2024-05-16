import { getOrderLines } from "../getOrderLines";
import { getOrderSource } from "../getOrderSource";
import { getOrdersBatch } from "./index";

jest.mock("../getOrderLines");
jest.mock("../getOrderSource");

describe("getOrdersBatch", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("converts orders correctly", () => {
    //@ts-ignore
    getOrderSource.mockReturnValue("CUSTOMER");
    //@ts-ignore
    getOrderLines.mockReturnValue([
      {
        id: "1",
        orderId: "1",
        kamiounOrderId: "",
        productId: "200",
        productPrice: 10.0,
        quantity: 2,
        totalPrice: 20.0,
        sku: "ABC123",
      },
    ]);

    expect(getOrdersBatch(orders)).toEqual(expectedOrders);
    expect(getOrderSource).toHaveBeenCalledWith(true, true);
    expect(getOrderLines).toHaveBeenCalledWith(orders[0].items);
  });

  test("returns an empty array when orders is undefined", () => {
    expect(getOrdersBatch(undefined)).toEqual([]);
  });

  test("returns an empty array when orders is null", () => {
    expect(getOrdersBatch(null)).toEqual([]);
  });

  test("returns an empty array when orders is an empty array", () => {
    expect(getOrdersBatch([])).toEqual([]);
  });
});

const orders = [
  {
    entity_id: 1,
    extension_attributes: {
      kamioun_order_id: "K123",
      delivery_agent_id: "D123",
      delivery_agent: "Agent A",
      delivery_date: "2022-01-01T00:00:00Z",
      deliveryStatus: "completed",
      verified: true,
      from_mobile: true,
    },
    state: "new",
    status: "processing",
    subtotal: 100,
    created_at: "2022-01-01T00:00:00Z",
    customer_id: 101,
    customer_firstname: "John",
    customer_lastname: "Doe",
    items: [
      {
        item_id: "1",
        order_id: "1",
        product_id: "200",
        base_price: 10.0,
        quantity_ordered: 2,
        price: 20.0,
        sku: "ABC123",
      },
    ],
  },
];

const expectedOrders = [
  {
    id: "1",
    kamiounId: "K123",
    state: "new",
    status: "processing",
    total: 100,
    createdAt: new Date("2022-01-01T00:00:00Z").getTime(),
    customerId: "101",
    customerFirstname: "John",
    customerLastname: "Doe",
    deliveryAgentId: "D123",
    deliveryStatus: "completed",
    deliveryAgent: "Agent A",
    deliveryDate: new Date("2022-01-01T00:00:00Z").getTime(),
    source: "CUSTOMER",
    lines: [
      {
        id: "1",
        orderId: "1",
        kamiounOrderId: "",
        productId: "200",
        productPrice: 10.0,
        quantity: 2,
        totalPrice: 20.0,
        sku: "ABC123",
      },
    ],
  },
];
