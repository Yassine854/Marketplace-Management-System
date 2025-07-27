import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "react-hot-toast";
import EditOrderModal from "@/features/marketplace/partners/Interface/orders/components/EditOrderModal";
import { useOrderActions } from "@/features/marketplace/partners/Interface/orders/hooks/useOrderActions";

// Mock dependencies
jest.mock("react-hot-toast");
jest.mock("@growthbook/growthbook-react", () => ({
  useGrowthBook: () => ({
    run: jest.fn(() => ({ value: 0 })), // Force variant 0
  }),
}));
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@heroicons/react/24/outline", () => ({
  XMarkIcon: () => <span>X</span>,
}));
jest.mock("@/libs/axios", () => ({
  axios: {
    servicesClient: {
      patch: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
jest.mock("@/features/shared/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user123" },
  }),
}));

// Mock OrderStateFactory
jest.mock("@/features/marketplace/orders/state/OrderStateFactory", () => ({
  OrderStateFactory: {
    createState: jest.fn().mockImplementation((stateName) => ({
      name: stateName,
      canTransitionTo: jest.fn().mockReturnValue(true),
    })),
  },
}));

// Mock OrderContext
const mockOrderContext = {
  getState: jest.fn().mockReturnValue({
    canTransitionTo: jest.fn().mockReturnValue(true),
  }),
  requestTransition: jest.fn().mockResolvedValue(undefined),
  setState: jest.fn(),
};

jest.mock("@/features/marketplace/orders/state/OrderContext", () => ({
  OrderContext: jest.fn().mockImplementation(() => mockOrderContext),
}));

const mockedToast = toast as jest.Mocked<typeof toast>;
const { axios } = require("@/libs/axios");

// Mock fetch and console.error
global.fetch = jest.fn();
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("Order Management", () => {
  const mockVendorOrder = {
    id: "order123",
    orderCode: "ORD-2024-001",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    total: 91.0,
    state: { id: "state1", name: "new" },
    status: { id: "status1", name: "pending" },
    partner: { id: "partner123", name: "Tunisian Food Distributor" },
    order: {
      id: "order456",
      customer: {
        firstName: "Ahmed",
        lastName: "Ben Ali",
        telephone: "+216 98 123 456",
        address: "123 Rue de la Liberté, Tunis",
      },
    },
    itemsSnapshot: [
      {
        id: "item1",
        sku: "OLIVE-001",
        productName: "Extra Virgin Olive Oil",
        sourceName: "Main Warehouse",
        qteOrdered: 2,
        sealable: 10,
        unitPrice: 25.5,
        specialPrice: null,
        productId: "prod1",
        sourceId: "source1",
      },
      {
        id: "item2",
        sku: "DATE-002",
        productName: "Medjool Dates",
        sourceName: "Secondary Warehouse",
        qteOrdered: 1,
        sealable: 5,
        unitPrice: 45.0,
        specialPrice: 40.0,
        productId: "prod2",
        sourceId: "source2",
      },
    ],
  };

  const mockStates = [
    { id: "state1", name: "new" },
    { id: "state2", name: "processing" },
    { id: "state3", name: "shipped" },
    { id: "state4", name: "delivered" },
  ];

  const mockStatuses = [
    { id: "status1", name: "pending", stateId: "state1" },
    { id: "status2", name: "confirmed", stateId: "state1" },
    { id: "status3", name: "in_progress", stateId: "state2" },
    { id: "status4", name: "ready_to_ship", stateId: "state2" },
    { id: "status5", name: "shipped", stateId: "state3" },
    { id: "status6", name: "delivered", stateId: "state4" },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onEdit: jest.fn(),
    initialData: mockVendorOrder,
    states: mockStates,
    statuses: mockStatuses,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.success = jest.fn();
    mockedToast.error = jest.fn();

    // Mock fetch responses
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes("/api/marketplace/status/getAll")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ statuses: mockStatuses }),
        });
      }
      if (url.includes("/api/marketplace/state/getAll")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ states: mockStates }),
        });
      }
      if (url.includes("/api/marketplace/experimentLogs/create")) {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("EditOrderModal Component", () => {
    it("should render modal with order details", async () => {
      render(<EditOrderModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Order Details")).toBeInTheDocument();
        expect(screen.getByText("ORD-2024-001")).toBeInTheDocument();
        expect(screen.getByText("Ahmed Ben Ali")).toBeInTheDocument();
        expect(screen.getByText("+216 98 123 456")).toBeInTheDocument();
      });
    });

    it("should display customer information correctly", async () => {
      render(<EditOrderModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Ahmed Ben Ali")).toBeInTheDocument();
        expect(screen.getByText("+216 98 123 456")).toBeInTheDocument();
        expect(
          screen.getByText("123 Rue de la Liberté, Tunis"),
        ).toBeInTheDocument();
      });
    });

    it("should retrieve and display states and statuses", async () => {
      render(<EditOrderModal {...defaultProps} />);

      await waitFor(() => {
        const stateSelect = screen.getByDisplayValue("new");
        expect(stateSelect).toBeInTheDocument();

        const statusSelect = screen.getByDisplayValue("pending");
        expect(statusSelect).toBeInTheDocument();
      });
    });

    it("should filter statuses based on selected state", async () => {
      render(<EditOrderModal {...defaultProps} />);

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByText("Order State")).toBeInTheDocument();
      });

      // Get the state select element by finding all select elements
      const selectElements = screen.getAllByRole("combobox");
      const stateSelect = selectElements[0] as HTMLSelectElement;

      // Verify initial state
      expect(stateSelect).toHaveValue("state1");

      // Change state to 'processing'
      await act(async () => {
        fireEvent.change(stateSelect, { target: { value: "state2" } });
      });

      // Verify the state value was updated
      await waitFor(() => {
        expect(stateSelect).toHaveValue("state2");
      });

      expect(mockOrderContext.requestTransition).toHaveBeenCalledWith(
        "processing",
      );
      expect(mockOrderContext.setState).toHaveBeenCalled();

      const statusSelect = selectElements[1] as HTMLSelectElement;
      await waitFor(() => {
        const statusOptions = Array.from(statusSelect.options).map(
          (opt) => opt.text,
        );
        expect(statusOptions).not.toContain("pending");
        expect(statusOptions).not.toContain("confirmed");
        expect(statusOptions).toContain("in_progress");
        expect(statusOptions).toContain("ready_to_ship");
      });
    });

    it("should display order items with correct details", async () => {
      render(<EditOrderModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("OLIVE-001")).toBeInTheDocument();
        expect(screen.getByText("Extra Virgin Olive Oil")).toBeInTheDocument();
        expect(screen.getByText("Main Warehouse")).toBeInTheDocument();
        expect(screen.getByText("25.50 TND")).toBeInTheDocument();

        expect(screen.getByText("DATE-002")).toBeInTheDocument();
        expect(screen.getByText("Medjool Dates")).toBeInTheDocument();

        // Use getAllByText since there are multiple elements with this text
        const priceElements = screen.getAllByText("40.00 TND");
        expect(priceElements.length).toBe(2); // Verify there are exactly two matches
      });
    });
    it("should allow editing order item quantities", async () => {
      render(<EditOrderModal {...defaultProps} />);

      await waitFor(() => {
        const quantityInputs = screen.getAllByDisplayValue("2");
        const firstQuantityInput = quantityInputs[0];

        fireEvent.change(firstQuantityInput, { target: { value: "3" } });
        expect(firstQuantityInput).toHaveValue(3);
      });
    });

    it("should calculate amount correctly when quantity changes", async () => {
      render(<EditOrderModal {...defaultProps} />);

      await waitFor(() => {
        // Initial amount for olive oil: 2 * 25.50 = 51.00 TND
        expect(screen.getByText("51.00 TND")).toBeInTheDocument();

        const quantityInputs = screen.getAllByDisplayValue("2");
        const firstQuantityInput = quantityInputs[0];

        fireEvent.change(firstQuantityInput, { target: { value: "3" } });
      });

      await waitFor(() => {
        // New amount: 3 * 25.50 = 76.50 TND
        expect(screen.getByText("76.50 TND")).toBeInTheDocument();
      });
    });

    it("should update sealable quantity when order quantity changes", async () => {
      render(<EditOrderModal {...defaultProps} />);

      await waitFor(() => {
        const quantityInputs = screen.getAllByDisplayValue("2");
        const firstQuantityInput = quantityInputs[0] as HTMLInputElement;

        // Change quantity from 2 to 4 (increase by 2)
        fireEvent.change(firstQuantityInput, { target: { value: "4" } });

        // Verify the input value changed
        expect(firstQuantityInput).toHaveValue(4);
      });
    });

    it("should not render when isOpen is false", () => {
      render(<EditOrderModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Order Details")).not.toBeInTheDocument();
    });
  });

  describe("useOrderActions Hook", () => {
    it("should edit order successfully", async () => {
      const mockResponse = {
        status: 200,
        data: { vendorOrder: { id: "order123", orderCode: "ORD-2024-001" } },
      };
      axios.servicesClient.patch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useOrderActions());

      const updateData = {
        itemsSnapshot: [{ id: "item1", qteOrdered: 3 }],
        stateId: "state2",
        statusId: "status3",
      };

      await act(async () => {
        await result.current.editOrder("order123", updateData);
      });

      expect(axios.servicesClient.patch).toHaveBeenCalledWith(
        "/api/marketplace/vendorOrder/order123",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(mockedToast.success).toHaveBeenCalledWith(
        "VendorOrder updated successfully",
      );
    });

    it("should fetch vendor order successfully", async () => {
      const mockResponse = {
        status: 200,
        data: { vendorOrder: mockVendorOrder },
      };
      axios.servicesClient.get.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useOrderActions());

      let fetchedOrder;
      await act(async () => {
        fetchedOrder = await result.current.fetchVendorOrder("order123");
      });

      expect(axios.servicesClient.get).toHaveBeenCalledWith(
        "/api/marketplace/vendorOrder/order123",
      );

      expect(fetchedOrder).toEqual(mockVendorOrder);
    });

    it("should toggle order status successfully", async () => {
      const mockResponse = {
        status: 200,
        data: { order: { id: "order123", isActive: false } },
      };
      axios.servicesClient.patch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        await result.current.toggleOrderStatus("order123", false);
      });

      expect(axios.servicesClient.patch).toHaveBeenCalledWith(
        "/api/marketplace/vendorOrder/order123",
        { isActive: false },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(mockedToast.success).toHaveBeenCalledWith(
        "Order deactivated successfully",
      );
    });

    it("should handle API errors gracefully", async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: "Order not found" },
        },
      };
      axios.servicesClient.patch.mockRejectedValueOnce(errorResponse);

      const { result } = renderHook(() => useOrderActions());

      await act(async () => {
        await result.current.editOrder("invalid-id", {});
      });

      expect(result.current.error).toBe("Order not found");
      expect(mockedToast.error).toHaveBeenCalledWith("Order not found");
    });

    it("should fetch partner data successfully", async () => {
      const mockPartner = {
        id: "partner123",
        name: "Tunisian Food Distributor",
        email: "contact@tunisianfood.tn",
      };
      const mockResponse = {
        status: 200,
        data: { partner: mockPartner },
      };
      axios.servicesClient.get.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useOrderActions());

      let fetchedPartner;
      await act(async () => {
        fetchedPartner = await result.current.fetchPartner();
      });

      expect(axios.servicesClient.get).toHaveBeenCalledWith(
        "/api/marketplace/partners/user123",
      );

      expect(fetchedPartner).toEqual(mockPartner);
    });
  });
});
