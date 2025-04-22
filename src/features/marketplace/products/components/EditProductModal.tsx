import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SkuPartner {
  id?: string;
  partnerId: string;
  skuPartner: string;
  partner?: { id: string; username: string };
}

interface ProductImage {
  id: string;
  url: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: any) => Promise<void>;
  product: any;
  suppliers: Array<{ id: string; companyName: string }>;
  productTypes: Array<{ id: string; type: string }>;
  typePcbs: Array<{ id: string; name: string }>;
  productStatuses: Array<{ id: string; name: string }>;
  subCategories: Array<{ id: string; name: string }>;
  relatedProducts: Array<{ id: string; name: string }>;
  taxes: Array<{ id: string; value: string }>;
  promotions: Array<{ id: string; promoPrice: string }>;
  partners: Array<{ id: string; username: string }>;
  skuPartners: SkuPartner[];
}

const EditProductModal = ({
  isOpen,
  onClose,
  onEdit,
  product,
  suppliers,
  productTypes,
  typePcbs,
  productStatuses,
  subCategories,
  relatedProducts,
  taxes,
  promotions,
  partners,
  skuPartners: initialSkuPartners,
}: EditProductModalProps) => {
  const [formState, setFormState] = useState({
    name: "",
    barcode: "",
    sku: "",
    price: 0,
    cost: undefined as number | undefined,
    stock: undefined as number | undefined,
    description: "",
    pcb: "",
    weight: undefined as number | undefined,
    minimumQte: undefined as number | undefined,
    maximumQte: undefined as number | undefined,
    sealable: undefined as number | undefined,
    alertQte: undefined as number | undefined,
    loyaltyPoints: undefined as number | undefined,
    loyaltyPointsAmount: undefined as number | undefined,
    supplierId: "",
    productTypeId: "",
    typePcbId: "",
    productStatusId: "",
    taxId: "",
    promotionId: "",
    subCategories: [] as string[],
    relatedProducts: [] as string[],
    promo: false,
    images: [] as File[],
  });

  const [skuPartners, setSkuPartners] = useState<SkuPartner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    if (product && isOpen) {
      setExistingImages(product.images || []);

      setFormState({
        name: product.name,
        barcode: product.barcode,
        sku: product.sku,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        description: product.description || "",
        pcb: product.pcb || "",
        weight: product.weight,
        minimumQte: product.minimumQte,
        maximumQte: product.maximumQte,
        sealable: product.sealable,
        alertQte: product.alertQte,
        loyaltyPoints: product.loyaltyPoints,
        loyaltyPointsAmount: product.loyaltyPointsAmount,
        supplierId: product.supplierId || null,
        productTypeId: product.productTypeId || null,
        typePcbId: product.typePcbId || null,
        productStatusId: product.productStatusId || null,
        taxId: product.taxId || null,
        promotionId: product.promotionId || null,
        subCategories:
          product.productSubCategories?.map((sc: any) => sc.subcategoryId) ||
          [],
        relatedProducts:
          product.relatedProducts?.map((rp: any) => rp.relatedProductId) || [],
        promo: product.promo,
        images: [],
      });

      setSkuPartners(
        initialSkuPartners.map((sp) => ({
          id: sp.id,
          partnerId: sp.partnerId,
          skuPartner: sp.skuPartner,
          partner: partners.find((p) => p.id === sp.partnerId),
        })),
      );
    }
  }, [product, isOpen, initialSkuPartners, partners]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/marketplace/image/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
      console.error("Delete image error:", error);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file)); // Use 'images' as field name
    formData.append("productId", product?.id);

    try {
      const response = await fetch("/api/marketplace/image/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Image upload failed");
      }

      const data = await response.json();
      return data.images; // Should return array of image objects with id/url
    } catch (error) {
      toast.error("impossible to upload image");
      return [];
    }
  };

  const handleInputChange = (field: string, value: any) => {
    // Convert empty strings to null for relational fields
    const relationalFields = [
      "supplierId",
      "productTypeId",
      "typePcbId",
      "productStatusId",
      "taxId",
      "promotionId",
    ];

    const cleanedValue = relationalFields.includes(field)
      ? value === ""
        ? null
        : value
      : value;

    setFormState((prev) => ({
      ...prev,
      [field]: cleanedValue,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleInputChange("images", Array.from(e.target.files));
    }
  };

  const handleSkuPartnerChange = (
    index: number,
    field: "partnerId" | "skuPartner",
    value: string,
  ) => {
    const updatedPartners = [...skuPartners];
    updatedPartners[index] = {
      ...updatedPartners[index],
      [field]: value,
      partner:
        field === "partnerId"
          ? partners.find((p) => p.id === value)
          : updatedPartners[index].partner,
    };
    setSkuPartners(updatedPartners);
  };

  const addSkuPartner = () => {
    setSkuPartners([...skuPartners, { partnerId: "", skuPartner: "" }]);
  };

  const removeSkuPartner = async (index: number) => {
    const partner = skuPartners[index];
    if (partner.id) {
      try {
        await fetch(`/api/marketplace/sku_partner/${partner.id}`, {
          method: "DELETE",
        });
        toast.success("SKU Partner removed");
      } catch (error) {
        toast.error("Failed to remove SKU Partner");
      }
    }
    setSkuPartners(skuPartners.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !formState.name ||
      !formState.barcode ||
      !formState.sku ||
      !formState.price
    ) {
      toast.error("Please fill in required fields");
      return;
    }

    const cleanedData = {
      ...formState,
      supplierId: formState.supplierId || null,
      productTypeId: formState.productTypeId || null,
      typePcbId: formState.typePcbId || null,
      productStatusId: formState.productStatusId || null,
      taxId: formState.taxId || null,
      promotionId: formState.promotionId || null,
    };

    setIsLoading(true);
    try {
      if (formState.images.length > 0) {
        const newImages = await handleImageUpload(formState.images);
        setExistingImages((prev) => [...prev, ...newImages]);
      }

      const updatedProductData = {
        ...cleanedData,
        id: product?.id,
        price: Number(cleanedData.price),
        cost: cleanedData.cost ? Number(cleanedData.cost) : undefined,
        stock: cleanedData.stock ? Number(cleanedData.stock) : undefined,
        subCategories: cleanedData.subCategories,
        relatedProducts: cleanedData.relatedProducts,
      };

      await onEdit(updatedProductData);

      // Handle SKU partners
      await Promise.all(
        skuPartners.map(async (sp) => {
          if (!sp.partnerId || !sp.skuPartner) return;

          const payload = {
            partnerId: sp.partnerId,
            skuPartner: sp.skuPartner,
            skuProduct: formState.sku,
            productId: product?.id,
          };

          if (sp.id) {
            await fetch(`/api/marketplace/sku_partner/${sp.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } else {
            await fetch("/api/marketplace/sku_partner/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }
        }),
      );

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Edit Product</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formState.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bar Code *
                </label>
                <input
                  type="text"
                  value={formState.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formState.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full rounded-lg border p-3"
                rows={3}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Specifications
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                PCB
              </label>
              <input
                type="text"
                value={formState.pcb}
                onChange={(e) => handleInputChange("pcb", e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <input
                type="number"
                value={formState.weight || ""}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Min Quantity
              </label>
              <input
                type="number"
                value={formState.minimumQte || ""}
                onChange={(e) =>
                  handleInputChange("minimumQte", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Quantity
              </label>
              <input
                type="number"
                value={formState.maximumQte || ""}
                onChange={(e) =>
                  handleInputChange("maximumQte", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sealable
              </label>
              <input
                type="number"
                value={formState.sealable || ""}
                onChange={(e) => handleInputChange("sealable", e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Alert Qte
              </label>
              <input
                type="number"
                value={formState.alertQte || ""}
                onChange={(e) => handleInputChange("alertQte", e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Pricing & Stock
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <input
                type="number"
                value={formState.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cost
              </label>
              <input
                type="number"
                value={formState.cost || ""}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={formState.stock || ""}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-semibold text-primary">
                Loyalty Program
              </h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Loyalty Points
                </label>
                <input
                  type="number"
                  value={formState.loyaltyPoints || ""}
                  onChange={(e) =>
                    handleInputChange("loyaltyPoints", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Loyalty Points Amount
                </label>
                <input
                  type="number"
                  value={formState.loyaltyPointsAmount || ""}
                  onChange={(e) =>
                    handleInputChange("loyaltyPointsAmount", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
          </div>
          {/* Relationships */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Relationships
            </h3>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="supplier-select"
              >
                Supplier
              </label>
              <select
                id="supplier-select"
                value={formState.supplierId}
                onChange={(e) =>
                  handleInputChange("supplierId", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="product-type-select"
              >
                Product Type
              </label>
              <select
                id="product-type-select"
                value={formState.productTypeId}
                onChange={(e) =>
                  handleInputChange("productTypeId", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">Product Type</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="pcb-type-select"
              >
                PCB Type
              </label>
              <select
                id="pcb-type-select"
                value={formState.typePcbId}
                onChange={(e) => handleInputChange("typePcbId", e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                <option value="">PCB Type</option>
                {typePcbs.map((pcb) => (
                  <option key={pcb.id} value={pcb.id}>
                    {pcb.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="product-status-select"
              >
                Product Status
              </label>
              <select
                id="product-status-select"
                value={formState.productStatusId}
                onChange={(e) =>
                  handleInputChange("productStatusId", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">Product Status</option>
                {productStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="tax-select"
              >
                Tax
              </label>
              <select
                id="tax-select"
                value={formState.taxId}
                onChange={(e) => handleInputChange("taxId", e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Tax</option>
                {taxes.map((tax) => (
                  <option key={tax.id} value={tax.id}>
                    {tax.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categories & Relations */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Sub-Categories & Related Products
            </h3>
            <select
              multiple
              value={formState.subCategories}
              onChange={(e) =>
                handleInputChange(
                  "subCategories",
                  Array.from(e.target.selectedOptions).map((o) => o.value),
                )
              }
              className="w-full rounded-lg border p-3"
            >
              {subCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              multiple
              value={formState.relatedProducts}
              onChange={(e) =>
                handleInputChange(
                  "relatedProducts",
                  Array.from(e.target.selectedOptions).map((o) => o.value),
                )
              }
              className="w-full rounded-lg border p-3"
            >
              {relatedProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Promotion */}
          <div className="space-y-4 pt-6 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">Promotion</h3>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formState.promo}
                onChange={(e) => handleInputChange("promo", e.target.checked)}
                className="h-5 w-5"
              />
              <span>Promo Product</span>
            </label>
            {formState.promo && (
              <select
                value={formState.promotionId}
                onChange={(e) =>
                  handleInputChange("promotionId", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Promotion</option>
                {promotions.map((promo) => (
                  <option key={promo.id} value={promo.id}>
                    {promo.promoPrice}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Images */}
          <div className="space-y-4 pt-6 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">Images</h3>

            {/* Existing images */}
            <div className="grid grid-cols-3 gap-4">
              {existingImages.map((image) => (
                <div key={image.id} className="group relative">
                  <img
                    src={image.url}
                    alt="Product"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* New image upload */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload New Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          {/* SKU Partners Section */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">Partner SKUs</h3>
            <div className="space-y-2">
              {skuPartners.map((partner, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={partner.partnerId}
                    onChange={(e) =>
                      handleSkuPartnerChange(index, "partnerId", e.target.value)
                    }
                    className="flex-1 rounded-lg border p-2"
                  >
                    <option value="">Select Partner</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.username}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Partner SKU"
                    value={partner.skuPartner}
                    onChange={(e) =>
                      handleSkuPartnerChange(
                        index,
                        "skuPartner",
                        e.target.value,
                      )
                    }
                    className="flex-1 rounded-lg border p-2"
                  />
                  <button
                    onClick={() => removeSkuPartner(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={addSkuPartner}
                className="w-full rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
              >
                + Add Partner SKU
              </button>
            </div>
          </div>

          {/* Other form sections remain the same... */}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-5 py-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
