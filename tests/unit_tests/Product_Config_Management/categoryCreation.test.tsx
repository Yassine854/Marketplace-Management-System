import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import CreateCategoryModal from "@/features/marketplace/products/categories/components/CreateCategoryModal";
import { useCreateCategory } from "@/features/marketplace/products/categories/hooks/useCreateCategory";

// Mock dependencies
jest.mock("axios");
jest.mock("react-hot-toast");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe("Category Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.success = jest.fn();
    mockedToast.error = jest.fn();
  });

  describe("CreateCategoryModal Component", () => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      onCreate: jest.fn(),
    };

    it("should render modal with all form fields", () => {
      render(<CreateCategoryModal {...defaultProps} />);

      expect(screen.getByText("Create New Category")).toBeInTheDocument();
      expect(screen.getByLabelText("Category Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Active Category")).toBeInTheDocument();
      expect(screen.getByLabelText("Category Image")).toBeInTheDocument();
    });

    it("should not submit when category name is empty", () => {
      const onCreate = jest.fn();
      render(<CreateCategoryModal {...defaultProps} onCreate={onCreate} />);

      const createButton = screen.getByRole("button", { name: /create/i });
      fireEvent.click(createButton);

      expect(onCreate).not.toHaveBeenCalled();
    });

    it("should submit with correct data when form is valid", () => {
      const onCreate = jest.fn();
      render(<CreateCategoryModal {...defaultProps} onCreate={onCreate} />);

      const nameInput = screen.getByLabelText("Category Name");
      const activeCheckbox = screen.getByLabelText("Active Category");

      fireEvent.change(nameInput, { target: { value: "Fresh Produce" } });
      fireEvent.click(activeCheckbox); // Make it inactive

      const createButton = screen.getByRole("button", { name: /create/i });
      fireEvent.click(createButton);

      expect(onCreate).toHaveBeenCalledWith({
        nameCategory: "Fresh Produce",
        isActive: false,
        image: null,
      });
    });
  });

  describe("useCreateCategory Hook", () => {
    it("should handle successful category creation", async () => {
      const mockResponse = {
        status: 201,
        data: { id: "1", nameCategory: "Beverages" },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateCategory());

      const categoryData = {
        nameCategory: "Beverages",
        isActive: true,
        image: null,
      };

      await act(async () => {
        await result.current.createCategory(categoryData, onSuccess);
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/marketplace/category/create",
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      expect(mockedToast.success).toHaveBeenCalledWith(
        "Category created successfully",
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    it("should handle API error with error message", async () => {
      const errorResponse = {
        response: {
          data: {
            message: "Category name already exists",
          },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const { result } = renderHook(() => useCreateCategory());

      const categoryData = {
        nameCategory: "Snacks & Confectionery",
        isActive: true,
        image: null,
      };

      await act(async () => {
        await result.current.createCategory(categoryData);
      });

      expect(result.current.error).toBe("Category name already exists");
      expect(mockedToast.error).toHaveBeenCalledWith(
        "Category name already exists",
      );
    });
  });
});
