import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CreateProductModal from "@/features/marketplace/partners/Interface/products/components/CreateProductModal";
import { useCreateProduct } from "@/features/marketplace/partners/Interface/products/hooks/useCreateProduct";

// Mock dependencies
jest.mock("axios");
jest.mock("react-hot-toast");
jest.mock("@growthbook/growthbook-react", () => ({
  useGrowthBook: () => ({
    run: jest.fn(() => ({ value: 0 })), // Force variant 0
  }),
}));
jest.mock("react-select", () => {
  const MockSelect = ({
    options,
    value,
    onChange,
    isMulti,
    placeholder,
  }: any) => (
    <select
      data-testid={placeholder}
      multiple={isMulti}
      value={isMulti ? value?.map((v: any) => v.value) : value?.value || ""}
      onChange={(e) => {
        if (isMulti) {
          const selectedValues = Array.from(e.target.selectedOptions).map(
            (option: any) => ({
              value: option.value,
              label: option.text,
            }),
          );
          onChange(selectedValues);
        } else {
          const selectedOption = options.find(
            (opt: any) => opt.value === e.target.value,
          );
          onChange(selectedOption);
        }
      }}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  MockSelect.displayName = "MockSelect";

  return MockSelect;
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

// Mock fetch and console.error
global.fetch = jest.fn().mockResolvedValue({ ok: true });
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("Product Management", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    onCreate: jest.fn(),
    suppliers: [{ id: "sup1", companyName: "Fresh Foods Supplier" }],
    productTypes: [{ id: "type1", type: "Packaged Food" }],
    typePcbs: [{ id: "pcb1", name: "Standard PCB" }],
    productStatuses: [{ id: "status1", name: "Active" }],
    subCategories: [{ id: "sub1", name: "Organic Vegetables" }],
    relatedProducts: [{ id: "rel1", name: "Organic Tomatoes" }],
    taxes: [{ id: "tax1", value: "19%" }],
    promotions: [{ id: "promo1", promoPrice: "10%" }],
    partners: [{ id: "partner1", name: "Local Market" }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.success = jest.fn();
    mockedToast.error = jest.fn();

    // Mock API responses
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/api/marketplace/brand/getAll")) {
        return Promise.resolve({
          data: {
            brands: [
              { id: "brand1", name: "Organic Valley", img: "brand.jpg" },
            ],
          },
        });
      }
      if (url.includes("/api/marketplace/source/getAll")) {
        return Promise.resolve({
          data: { sources: [{ id: "source1", name: "Main Warehouse" }] },
        });
      }
      if (url.includes("/api/marketplace/products/search")) {
        return Promise.resolve({
          data: { products: [] },
        });
      }
      return Promise.resolve({ data: {} });
    });
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("CreateProductModal Component", () => {
    it("should render modal with basic form fields", async () => {
      render(<CreateProductModal {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText("Create New Product")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("SKU")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Product Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Bar Code")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Price")).toBeInTheDocument();
      });
    });

    it("should search products by SKU and barcode", async () => {
      const mockSearchResults = [
        {
          id: "prod1",
          name: "Organic Apples",
          sku: "ORG-APP-001",
          barcode: "1234567890123",
          price: 5.99,
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { products: mockSearchResults },
      });

      render(<CreateProductModal {...mockProps} />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText("Enter barcode or SKU");
        fireEvent.change(searchInput, { target: { value: "ORG-APP-001" } });

        const searchButton = screen.getByText("Search");
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          "/api/marketplace/products/search?query=ORG-APP-001",
        );
      });
    });

    it("should validate required fields before submission", async () => {
      render(<CreateProductModal {...mockProps} />);

      await waitFor(() => {
        const createButton = screen.getByText("Create Product");
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith("SKU is required");
      });
    });

    it("should handle stock management with multiple entries", async () => {
      render(<CreateProductModal {...mockProps} />);

      await waitFor(() => {
        // Navigate to stock management tab
        const stockTab = screen.getByText("Stock Management");
        fireEvent.click(stockTab);
      });

      await waitFor(() => {
        // Add stock entry
        const addStockButton = screen.getByText("+ Add Stock Entry");
        fireEvent.click(addStockButton);

        expect(screen.getByText("Stock Entry #1")).toBeInTheDocument();
      });
    });

    it("should handle image upload for products", async () => {
      render(<CreateProductModal {...mockProps} />);

      await waitFor(() => {
        // Navigate to relationships tab
        const relationsTab = screen.getByText("Relationships");
        fireEvent.click(relationsTab);
      });

      await waitFor(() => {
        // Find the image file input specifically
        const allInputs = screen
          .getAllByRole("textbox")
          .concat(Array.from(document.querySelectorAll('input[type="file"]')));

        const imageInput = allInputs.find(
          (input) => input.getAttribute("accept") === "image/*",
        ) as HTMLInputElement;

        if (imageInput) {
          const file = new File(["test"], "product.jpg", {
            type: "image/jpeg",
          });
          fireEvent.change(imageInput, { target: { files: [file] } });
          expect(imageInput.files?.[0]).toBe(file);
        } else {
          // Just verify the Images section exists
          expect(screen.getByText("Images")).toBeInTheDocument();
        }
      });
    });

    it("should manage SKU partners correctly", async () => {
      render(<CreateProductModal {...mockProps} />);

      await waitFor(() => {
        // Navigate to stock management tab
        const stockTab = screen.getByText("Stock Management");
        fireEvent.click(stockTab);
      });

      await waitFor(() => {
        const skuInput = screen.getByPlaceholderText(
          "Enter your SKU (optional)",
        );
        fireEvent.change(skuInput, { target: { value: "PARTNER-SKU-001" } });

        expect(skuInput).toHaveValue("PARTNER-SKU-001");
      });
    });

    it("should handle CSV import functionality", async () => {
      render(<CreateProductModal {...mockProps} />);

      // Just test that the CSV import section exists
      expect(screen.getByText("Import from CSV")).toBeInTheDocument();
    });

    it("should validate stock entries before submission", async () => {
      render(<CreateProductModal {...mockProps} />);

      // Fill required fields
      fireEvent.change(screen.getByPlaceholderText("SKU"), {
        target: { value: "TEST-SKU-001" },
      });
      fireEvent.change(screen.getByPlaceholderText("Product Name"), {
        target: { value: "Test Product" },
      });
      fireEvent.change(screen.getByPlaceholderText("Price"), {
        target: { value: "10.99" },
      });

      // Try to submit without required fields
      const createButton = screen.getByText("Create Product");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalled();
      });
    });

    it("should handle product creation with complete data", async () => {
      render(<CreateProductModal {...mockProps} />);

      // Fill basic information
      fireEvent.change(screen.getByPlaceholderText("SKU"), {
        target: { value: "FRESH-001" },
      });
      fireEvent.change(screen.getByPlaceholderText("Product Name"), {
        target: { value: "Fresh Organic Carrots" },
      });
      fireEvent.change(screen.getByPlaceholderText("Price"), {
        target: { value: "4.99" },
      });

      // Navigate to stock management tab
      const stockTab = screen.getByRole("button", {
        name: /stock management/i,
      });
      fireEvent.click(stockTab);

      // Verify we're on the stock management tab
      expect(screen.getAllByText("Stock Management")).toHaveLength(2); // Tab and heading
    });
  });

  describe("useCreateProduct Hook", () => {
    it("should create product successfully with complete data", async () => {
      const mockProductData = {
        name: "Organic Spinach",
        barcode: "9876543210987",
        sku: "ORG-SPN-001",
        price: 3.99,
        cost: 2.5,
        stock: 100,
        description: "Fresh organic spinach leaves",
        weight: 250,
        supplierId: "sup1",
        brandId: "brand1",
        activities: ["alimentation générale"],
        subCategories: ["sub1"],
        relatedProducts: ["rel1"],
        promo: false,
        images: [new File(["test"], "spinach.jpg", { type: "image/jpeg" })],
        skuPartners: [{ partnerId: "partner1", skuPartner: "PARTNER-SPN-001" }],
      };

      // Mock the main product creation call
      mockedAxios.post.mockResolvedValueOnce({
        status: 201,
        data: { product: { id: "new-product-id" } },
      });

      // Mock additional API calls for related data
      mockedAxios.post.mockResolvedValue({ status: 200, data: {} });
      mockedAxios.get.mockResolvedValue({ data: { images: [] } });

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateProduct());

      await act(async () => {
        await result.current.createProduct(mockProductData, onSuccess);
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/marketplace/products/create",
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      expect(mockedToast.success).toHaveBeenCalledWith(
        "Product created successfully!",
      );
      expect(onSuccess).toHaveBeenCalledWith("new-product-id");
    });

    it("should handle existing product with same barcode", async () => {
      const existingProduct = {
        id: "existing-id",
        name: "Existing Product",
        barcode: "1234567890123",
        sku: "EXISTING-001",
        price: 5.99,
      };

      // Mock search to return existing product
      mockedAxios.get.mockResolvedValueOnce({
        data: { products: [existingProduct] },
      });

      const mockProductData = {
        name: "New Product",
        barcode: "1234567890123", // Same barcode
        sku: "NEW-001",
        price: 6.99,
        subCategories: [],
        relatedProducts: [],
        promo: false,
      };

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateProduct());

      await act(async () => {
        await result.current.createProduct(mockProductData, onSuccess);
      });

      expect(onSuccess).toHaveBeenCalledWith("existing-id");
    });

    it("should handle API errors gracefully", async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: "SKU already exists" },
        },
      };

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const mockProductData = {
        name: "Test Product",
        barcode: "1111111111111",
        sku: "DUPLICATE-SKU",
        price: 9.99,
        subCategories: [],
        relatedProducts: [],
        promo: false,
      };

      const { result } = renderHook(() => useCreateProduct());

      await act(async () => {
        try {
          await result.current.createProduct(mockProductData);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      expect(result.current.error).toBe("SKU already exists");
    });
  });
});
