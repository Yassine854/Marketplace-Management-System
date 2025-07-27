import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "react-hot-toast";
import CreateBrandModal from "@/features/marketplace/brand/components/CreateBrandModal";
import { useCreateBrand } from "@/features/marketplace/brand/hooks/useCreateBrand";

// Mock dependencies
jest.mock("react-hot-toast");
jest.mock("@heroicons/react/24/outline", () => ({
  XMarkIcon: () => <span>X</span>,
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

// Mock console.error
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("Brand Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.success = jest.fn();
    mockedToast.error = jest.fn();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("CreateBrandModal Component", () => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onCreate: jest.fn(),
    };

    it("should render modal with form fields", () => {
      render(<CreateBrandModal {...defaultProps} />);

      expect(screen.getByText("Create New Brand")).toBeInTheDocument();
      expect(screen.getByLabelText("Brand Name *")).toBeInTheDocument();
      expect(screen.getByLabelText("Brand Logo *")).toBeInTheDocument();
    });

    it("should show error when submitting without required fields", () => {
      render(<CreateBrandModal {...defaultProps} />);

      const createButton = screen.getByText("Create");
      fireEvent.click(createButton);

      expect(
        screen.getByText("Please select a brand logo image"),
      ).toBeInTheDocument();
    });

    it("should submit with correct data when form is valid", () => {
      const onCreate = jest.fn();
      render(<CreateBrandModal {...defaultProps} onCreate={onCreate} />);

      const nameInput = screen.getByLabelText("Brand Name *");
      const fileInput = screen.getByLabelText(
        "Brand Logo *",
      ) as HTMLInputElement;
      const file = new File(["test"], "logo.jpg", { type: "image/jpeg" });

      fireEvent.change(nameInput, { target: { value: "Fresh Farms" } });
      fireEvent.change(fileInput, { target: { files: [file] } });

      const createButton = screen.getByText("Create");
      fireEvent.click(createButton);

      expect(onCreate).toHaveBeenCalledWith({
        name: "Fresh Farms",
        image: file,
      });
    });
  });

  describe("useCreateBrand Hook", () => {
    it("should handle successful brand creation", async () => {
      const mockResponse = {
        status: 201,
        data: { id: "1", name: "Organic Valley" },
      };
      axios.servicesClient.post.mockResolvedValueOnce(mockResponse);

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateBrand());

      const file = new File(["test"], "logo.jpg", { type: "image/jpeg" });
      const brandData = {
        name: "Organic Valley",
        image: file,
      };

      await act(async () => {
        await result.current.createBrand(brandData, onSuccess);
      });

      expect(mockedToast.success).toHaveBeenCalledWith(
        "Brand created successfully",
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    it("should handle API error", async () => {
      const errorResponse = {
        response: { data: { message: "Brand name already exists" } },
      };
      axios.servicesClient.post.mockRejectedValueOnce(errorResponse);

      const { result } = renderHook(() => useCreateBrand());

      const file = new File(["test"], "logo.jpg", { type: "image/jpeg" });
      const brandData = {
        name: "Duplicate Brand",
        image: file,
      };

      await act(async () => {
        await result.current.createBrand(brandData);
      });

      expect(result.current.error).toBe("Brand name already exists");
      expect(mockedToast.error).toHaveBeenCalledWith(
        "Brand name already exists",
      );
    });
  });
});
