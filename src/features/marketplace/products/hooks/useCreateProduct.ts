// hooks/useCreateProduct.ts
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface CreateProductData {
  name: string;
  barcode: string;
  sku: string;
  price: number;
  cost?: number;
  stock?: number;
  description?: string;
  pcb?: string;
  weight?: number;
  minimumQte?: number;
  maximumQte?: number;
  sealable?: number;
  alertQte?: number;
  loyaltyPointsPerProduct?: number;
  loyaltyPointsPerUnit?: number;
  loyaltyPointsBonusQuantity?: number;
  loyaltyPointsThresholdQty?: number;
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
  skuPartners?: Array<{
    partnerId: string;
    skuPartner: string;
  }>;
  activities?: string[];
  brandId?: string;
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
        if (key === "skuPartners") return; // Skip skuPartners for now
        if (key === "activities") return; // Skip activities for now, we'll handle them separately

        if (Array.isArray(value)) {
          value.forEach((item, index) =>
            formData.append(`${key}[${index}]`, item),
          );
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add activities to formData
      if (productData.activities && productData.activities.length > 0) {
        productData.activities.forEach((activity, index) => {
          formData.append(`activities[${index}]`, activity);
        });
      }

      // Add brandId to formData if provided
      if (productData.brandId) {
        formData.append("brandId", productData.brandId);
      }

      if (productData.promo !== undefined) {
        formData.append("promo", productData.promo.toString());
      }

      // Debug: Log what's being sent
      console.log("FormData contents:");
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      const response = await axios.post(
        "/api/marketplace/products/create",
        formData,
      );

      if (response.status == 200 || response.status == 201) {
        toast.success("Product created successfully!");
      }

      const productId = response.data.product.id;

      const promises = [
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
      ];

      // Add SKU partner creation promises
      if (productData.skuPartners && productData.skuPartners.length > 0) {
        const validSkuPartners = productData.skuPartners.filter(
          (partner) => partner.partnerId,
        );

        promises.push(
          ...validSkuPartners.map((partner) =>
            axios.post("/api/marketplace/sku_partner/create", {
              productId,
              partnerId: partner.partnerId,
              skuPartner: partner.skuPartner || productData.sku,
              skuProduct: productData.sku,
            }),
          ),
        );
      }

      // Only add image upload promise if there are images
      if (images.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append("productId", productId);
        images.forEach((image) => {
          imageFormData.append("images", image);
        });

        promises.push(
          axios.post("/api/marketplace/image/create", imageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        );
      }

      await Promise.all(promises);

      if (response.status === 201 && response.data.product?.id) {
        onSuccess?.(response.data.product.id);
        return response.data.product;
      }

      return null;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error creating product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createProduct, isLoading, error };
}
