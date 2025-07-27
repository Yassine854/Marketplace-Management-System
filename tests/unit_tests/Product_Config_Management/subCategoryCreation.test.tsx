import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import CreateSubCategoryModal from "@/features/marketplace/products/categories/subCategories/components/CreateSubCategoryModal";
import { useCreateSubCategory } from "@/features/marketplace/products/categories/subCategories/hooks/useCreateSubCategory";

// Mock dependencies
jest.mock("axios");
jest.mock("react-hot-toast");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe("SubCategory Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.success = jest.fn();
    mockedToast.error = jest.fn();
  });

  describe("CreateSubCategoryModal Component", () => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onCreate: jest.fn(),
      categoryId: "category-123",
    };

    it("should render modal with all form fields", () => {
      render(<CreateSubCategoryModal {...defaultProps} />);

      expect(screen.getByText("Create New Subcategory")).toBeInTheDocument();
      expect(screen.getByLabelText("Subcategory Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Active Subcategory")).toBeInTheDocument();
      expect(screen.getByLabelText("Subcategory Image")).toBeInTheDocument();
    });

    it("should not submit when subcategory name is empty", () => {
      const onCreate = jest.fn();
      render(<CreateSubCategoryModal {...defaultProps} onCreate={onCreate} />);

      const createButton = screen.getByRole("button", { name: /create/i });
      fireEvent.click(createButton);

      expect(onCreate).not.toHaveBeenCalled();
    });

    it("should not submit when categoryId is null", () => {
      const onCreate = jest.fn();
      render(
        <CreateSubCategoryModal
          {...defaultProps}
          onCreate={onCreate}
          categoryId={null}
        />,
      );

      const nameInput = screen.getByLabelText("Subcategory Name");
      const createButton = screen.getByRole("button", { name: /create/i });

      fireEvent.change(nameInput, { target: { value: "Fresh Fruits" } });
      fireEvent.click(createButton);

      expect(onCreate).not.toHaveBeenCalled();
    });

    it("should submit with correct data when form is valid", () => {
      const onCreate = jest.fn();
      render(<CreateSubCategoryModal {...defaultProps} onCreate={onCreate} />);

      const nameInput = screen.getByLabelText("Subcategory Name");
      const activeCheckbox = screen.getByLabelText("Active Subcategory");

      fireEvent.change(nameInput, { target: { value: "Organic Vegetables" } });
      fireEvent.click(activeCheckbox); // Make it inactive

      const createButton = screen.getByRole("button", { name: /create/i });
      fireEvent.click(createButton);

      expect(onCreate).toHaveBeenCalledWith({
        name: "Organic Vegetables",
        isActive: false,
        image: null,
        categoryId: "category-123",
      });
    });
  });

  describe("useCreateSubCategory Hook", () => {
    it("should handle successful subcategory creation", async () => {
      const mockResponse = {
        status: 201,
        data: { id: "1", name: "Dairy Products" },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateSubCategory());

      const subCategoryData = {
        name: "Dairy Products",
        isActive: true,
        image: null,
        categoryId: "category-123",
      };

      await act(async () => {
        await result.current.createSubCategory(subCategoryData, onSuccess);
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/marketplace/sub_category/create",
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      expect(mockedToast.success).toHaveBeenCalledWith(
        "Subcategory created successfully",
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    it("should handle API error with error message", async () => {
      const errorResponse = {
        response: {
          data: {
            message: "Subcategory name already exists",
          },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const { result } = renderHook(() => useCreateSubCategory());

      const subCategoryData = {
        name: "Frozen Foods",
        isActive: true,
        image: null,
        categoryId: "category-123",
      };

      await act(async () => {
        await result.current.createSubCategory(subCategoryData);
      });

      expect(result.current.error).toBe("Subcategory name already exists");
      expect(mockedToast.error).toHaveBeenCalledWith(
        "Subcategory name already exists",
      );
    });
  });
});
