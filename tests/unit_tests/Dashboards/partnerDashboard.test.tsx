import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import Dashboard from "@/features/marketplace/partners/Interface/dashboard/pages/Dashboard";
import TotalOrderAmountChart from "@/features/marketplace/partners/Interface/dashboard/charts/TotalOrderAmountChart";
import TotalCustomersChart from "@/features/marketplace/partners/Interface/dashboard/charts/TotalCustomersChart";
import { useTotalOrderAmount } from "@/features/marketplace/partners/Interface/dashboard/hooks/useTotalOrderAmount";
import { useTotalCustomers } from "@/features/marketplace/partners/Interface/dashboard/hooks/useTotalCustomers";

// Mock dependencies
jest.mock("axios");
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));
jest.mock("@growthbook/growthbook-react", () => ({
  useGrowthBook: () => ({
    run: jest.fn(() => ({ value: 0 })),
  }),
}));

// Mock chart components
jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/TotalOrdersMonth",
  () => {
    return function MockTotalOrdersMonth() {
      return <div data-testid="orders-month-chart">Orders Month Chart</div>;
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/OrderCountMonth",
  () => {
    return function MockOrderCountMonth() {
      return <div data-testid="order-count-chart">Order Count Chart</div>;
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/TotalProductsChart",
  () => {
    return function MockTotalProductsChart({ total }: { total: number }) {
      return <div data-testid="products-chart">Products: {total}</div>;
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/TotalOrdersChart",
  () => {
    return function MockTotalOrdersChart({ total }: { total: number }) {
      return <div data-testid="orders-chart">Orders: {total}</div>;
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/StockLevelsSource",
  () => {
    return function MockStockLevelsSource() {
      return <div data-testid="stocklevelssource-chart">StockLevelsSource</div>;
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/MostOrderedProducts",
  () => {
    return function MockMostOrderedProducts() {
      return (
        <div data-testid="mostorderedproducts-chart">MostOrderedProducts</div>
      );
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/MostRefundedProducts",
  () => {
    return function MockMostRefundedProducts() {
      return (
        <div data-testid="mostrefundedproducts-chart">MostRefundedProducts</div>
      );
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/OrderCountStatus",
  () => {
    return function MockOrderCountStatus() {
      return <div data-testid="ordercountstatus-chart">OrderCountStatus</div>;
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/CustomerTypeDistribution",
  () => {
    return function MockCustomerTypeDistribution() {
      return (
        <div data-testid="customertypedistribution-chart">
          CustomerTypeDistribution
        </div>
      );
    };
  },
);

jest.mock(
  "@/features/marketplace/partners/Interface/dashboard/charts/TotalOrdersSource",
  () => {
    return function MockTotalOrdersSource() {
      return <div data-testid="totalorderssource-chart">TotalOrdersSource</div>;
    };
  },
);

const mockedAxios = axios as jest.Mocked<typeof axios>;
const { useSession } = require("next-auth/react");

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

describe("Partner Dashboard Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default session mock
    useSession.mockReturnValue({
      data: {
        user: {
          id: "partner123",
          userType: "partner",
        } as any,
        expires: "2024-12-31",
      },
      status: "authenticated",
      update: jest.fn(),
    });

    // Default API mocks
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("totalAmount")) {
        return Promise.resolve({ data: { totalAmount: 5000 } });
      }
      if (url.includes("vendorOrder/getAll")) {
        return Promise.resolve({
          data: {
            vendorOrders: [
              { id: "vo1", order: { customer: { id: "c1" } } },
              { id: "vo2", order: { customer: { id: "c2" } } },
            ],
          },
        });
      }
      if (url.includes("products/getAll")) {
        return Promise.resolve({
          data: {
            products: [
              { id: "p1", partnerId: "partner123" },
              { id: "p2", partnerId: "partner123" },
            ],
          },
        });
      }
      return Promise.resolve({ data: {} });
    });
  });

  // Test 1: Dashboard renders loading state
  it("should show loading spinner initially", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    render(<Dashboard />);

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  // Test 2: Dashboard renders error state
  it("should show error message when API fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    render(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Error loading dashboard stats."),
      ).toBeInTheDocument();
    });
  });

  // Test 3: Dashboard renders successfully with data
  it("should render dashboard with summary cards", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("products-chart")).toBeInTheDocument();
      expect(screen.getByTestId("orders-chart")).toBeInTheDocument();
    });
  });

  // Test 4: TotalOrderAmountChart displays correct amount
  it("should display formatted currency amount", () => {
    render(<TotalOrderAmountChart totalAmount={1500.5} />);

    expect(screen.getByText("Sales Revenue")).toBeInTheDocument();
    expect(screen.getByText("1 500,500 DT")).toBeInTheDocument();
  });

  // Test 5: TotalCustomersChart displays correct count
  it("should display customer count", () => {
    render(<TotalCustomersChart total={25} />);

    expect(screen.getByText("Total Customers")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  // Test 6: useTotalOrderAmount hook fetches data
  it("should fetch total order amount", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { totalAmount: 2500 },
    });

    const { result } = renderHook(() => useTotalOrderAmount());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.totalAmount).toBe(2500);
      expect(result.current.isError).toBe(false);
    });
  });

  // Test 7: useTotalCustomers hook calculates unique customers
  it("should calculate unique customers from orders", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        vendorOrders: [
          { order: { customer: { id: "c1" } } },
          { order: { customer: { id: "c2" } } },
          { order: { customer: { id: "c1" } } }, // duplicate
        ],
      },
    });

    const { result } = renderHook(() => useTotalCustomers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.total).toBe(2); // unique customers
    });
  });

  // Test 8: Hook handles API error
  it("should handle API error in hooks", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useTotalOrderAmount());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.totalAmount).toBe(0);
    });
  });

  // Test 9: Dashboard renders all chart components
  it("should render all dashboard charts", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("orders-month-chart")).toBeInTheDocument();
      expect(screen.getByTestId("order-count-chart")).toBeInTheDocument();
      expect(screen.getByTestId("stocklevelssource-chart")).toBeInTheDocument();
    });
  });

  // Test 10: TotalOrderAmountChart handles zero amount
  it("should handle zero amount in chart", () => {
    render(<TotalOrderAmountChart totalAmount={0} />);

    expect(screen.getByText("0,000 DT")).toBeInTheDocument();
  });

  // Test 11: Hook handles empty data response
  it("should handle empty vendor orders", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { vendorOrders: [] },
    });

    const { result } = renderHook(() => useTotalCustomers());

    await waitFor(() => {
      expect(result.current.total).toBe(0);
      expect(result.current.isError).toBe(false);
    });
  });

  // Test 12: Dashboard handles missing data gracefully
  it("should handle missing data in API response", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {}, // missing expected fields
    });

    const { result } = renderHook(() => useTotalOrderAmount());

    await waitFor(() => {
      expect(result.current.totalAmount).toBe(0);
      expect(result.current.isError).toBe(false);
    });
  });
});
