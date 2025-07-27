import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "react-hot-toast";
import CreateSupplierModal from "@/features/marketplace/products/suppliers/components/CreateSupplierModal";
import { useCreateSupplier } from "@/features/marketplace/products/suppliers/hooks/useCreateSupplier";

// Mock dependencies
jest.mock("react-hot-toast");
jest.mock("@growthbook/growthbook-react", () => ({
  useGrowthBook: () => ({
    run: jest.fn(() => ({ value: 0 })),
  }),
}));
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));
jest.mock("lucide-react", () => ({
  X: () => <span>X</span>,
}));
jest.mock("@/libs/axios", () => ({
  axios: {
    servicesClient: {
      post: jest.fn(),
    },
  },
}));

const mockedToast = toast as jest.Mocked<typeof toast>;
const { axios } = require("@/libs/axios");

// Mock fetch and console.error
global.fetch = jest.fn().mockResolvedValue({ ok: true });
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("Supplier Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.success = jest.fn();
    mockedToast.error = jest.fn();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("CreateSupplierModal Component", () => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onCreate: jest.fn(),
      isLoading: false,
      error: null,
    };

    it("should render modal with form fields", () => {
      render(<CreateSupplierModal {...defaultProps} />);

      expect(screen.getByText("Create New Supplier")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Company Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Code")).toBeInTheDocument();
      expect(screen.getByText("Create Supplier")).toBeInTheDocument();
    });

    it("should update form fields when user types", () => {
      render(<CreateSupplierModal {...defaultProps} />);

      const companyNameInput = screen.getByPlaceholderText("Company Name");
      const codeInput = screen.getByPlaceholderText("Code");

      fireEvent.change(companyNameInput, {
        target: { value: "Fresh Produce Co" },
      });
      fireEvent.change(codeInput, { target: { value: "FP001" } });

      expect(companyNameInput).toHaveValue("Fresh Produce Co");
      expect(codeInput).toHaveValue("FP001");
    });

    it("should not render when isOpen is false", () => {
      render(<CreateSupplierModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Create New Supplier")).not.toBeInTheDocument();
    });
  });

  describe("useCreateSupplier Hook", () => {
    it("should handle successful supplier creation", async () => {
      const mockResponse = { status: 201, data: { id: "1" } };
      axios.servicesClient.post.mockResolvedValueOnce(mockResponse);

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateSupplier());

      const supplierData = {
        manufacturerId: 1,
        code: "DF001",
        companyName: "Dairy Farm Ltd",
        contactName: "",
        phoneNumber: "",
        postalCode: "",
        city: "",
        country: "",
        capital: "",
        email: "",
        address: "",
        categories: ["dairy"],
      };

      await act(async () => {
        await result.current.createSupplier(supplierData, onSuccess);
      });

      expect(mockedToast.success).toHaveBeenCalledWith(
        "Supplier created successfully",
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    it("should handle API error", async () => {
      const errorResponse = {
        response: { data: { message: "Supplier already exists" } },
      };
      axios.servicesClient.post.mockRejectedValueOnce(errorResponse);

      const { result } = renderHook(() => useCreateSupplier());

      await act(async () => {
        await result.current.createSupplier({
          manufacturerId: 0,
          code: "T001",
          companyName: "Test Supplier",
          contactName: "",
          phoneNumber: "",
          postalCode: "",
          city: "",
          country: "",
          capital: "",
          email: "",
          address: "",
          categories: [],
        });
      });

      expect(result.current.error).toBe("Supplier already exists");
      expect(mockedToast.error).toHaveBeenCalledWith("Supplier already exists");
    });
  });
});
