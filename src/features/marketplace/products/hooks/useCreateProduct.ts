// hooks/useCreateProduct.ts
import { useState } from "react";
import axios from "axios";

interface CreateProductData {
  name: string;
  sku: string;
  price: number;
  cost?: number;
  stock?: number;
  description?: string;
  pcb?: string;
  weight?: number;
  minimumQte?: number;
  maximumQte?: number;
  sealable?: number; // Updated field
  alertQte?: number; // Updated field
  loyaltyPoints?: number; // New field
  loyaltyPointsAmount?: number; // New field
  supplierId?: string;
  productTypeId?: string;
  typePcbId?: string;
  productStatusId?: string;
  taxId?: string;
  promotionId?: string;
  subCategories: string[];
  relatedProducts: string[];
  promo: boolean;
  images?: File[];
}

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (
    productData: CreateProductData,
    onSuccess?: (productId: string) => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      const images = productData.images || [];

      Object.entries(productData).forEach(([key, value]) => {
        if (key === "images") return;

        if (Array.isArray(value)) {
          value.forEach((item, index) =>
            formData.append(`${key}[${index}]`, item),
          );
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      if (productData.promo !== undefined) {
        formData.append("promo", productData.promo.toString());
      }

      const response = await axios.post(
        "/api/marketplace/products/create",
        formData,
      );

      const productId = response.data.product.id;

      const imageFormData = new FormData();
      imageFormData.append("productId", productId);
      images.forEach((image) => {
        imageFormData.append("images", image);
      });

      await Promise.all([
        axios.post("/api/marketplace/product_subcategories/create", {
          productId,
          subCategoryIds: productData.subCategories,
        }),

        ...productData.subCategories.map((subcategoryId) =>
          axios.post("/api/marketplace/product_subcategories/create", {
            productId,
            subcategoryId,
          }),
        ),

        ...productData.relatedProducts.map((relatedProductId) =>
          axios.post("/api/marketplace/related_products/create", {
            productId,
            relatedProductId,
          }),
        ),

        ...productData.relatedProducts.map((relatedProductId) =>
          axios.post("/api/marketplace/related_products/create", {
            productId,
            relatedProductId,
          }),
        ),

        ...images.map((image) =>
          axios.post("/api/marketplace/related_products/create", {
            productId,
            image,
          }),
        ),

        axios.post("/api/marketplace/image/create", imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      ]);

      if (response.status === 201 && response.data.product?.id) {
        onSuccess?.(response.data.product.id);
        return response.data.product;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating product");
      console.error("Product creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createProduct, isLoading, error };
}
