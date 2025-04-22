import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (product: {
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
    loyaltyPoints?: number;
    loyaltyPointsAmount?: number;
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
  }) => Promise<any>; // Updated return type
  suppliers: Array<{ id: string; companyName: string }>;
  productTypes: Array<{ id: string; type: string }>;
  typePcbs: Array<{ id: string; name: string }>;
  productStatuses: Array<{ id: string; name: string }>;
  subCategories: Array<{ id: string; name: string }>;
  relatedProducts: Array<{ id: string; name: string }>;
  taxes: Array<{ id: string; value: string }>;
  promotions: Array<{ id: string; promoPrice: string }>;
}

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
  suppliers,
  productTypes,
  typePcbs,
  productStatuses,
  subCategories,
  relatedProducts,
  taxes,
  promotions,
}: CreateProductModalProps) => {
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

  useEffect(() => {
    if (!isOpen) {
      setFormState({
        name: "",
        barcode: "",
        sku: "",
        price: 0,
        cost: undefined,
        stock: undefined,
        description: "",
        pcb: "",
        weight: undefined,
        minimumQte: undefined,
        maximumQte: undefined,
        sealable: undefined,
        alertQte: undefined,
        loyaltyPoints: undefined,
        loyaltyPointsAmount: undefined,
        supplierId: "",
        productTypeId: "",
        typePcbId: "",
        productStatusId: "",
        taxId: "",
        promotionId: "",
        subCategories: [],
        relatedProducts: [],
        promo: false,
        images: [],
      });
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleInputChange("images", Array.from(e.target.files));
    }
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

    try {
      // Convert empty strings to undefined for relational fields
      const payload = {
        ...formState,
        price: Number(formState.price),
        cost: formState.cost ? Number(formState.cost) : undefined,
        stock: formState.stock ? Number(formState.stock) : undefined,
        weight: formState.weight ? Number(formState.weight) : undefined,
        minimumQte: formState.minimumQte
          ? Number(formState.minimumQte)
          : undefined,
        maximumQte: formState.maximumQte
          ? Number(formState.maximumQte)
          : undefined,
        sealable: formState.sealable ? Number(formState.sealable) : undefined,
        alertQte: formState.alertQte ? Number(formState.alertQte) : undefined,
        loyaltyPoints: formState.loyaltyPoints
          ? Number(formState.loyaltyPoints)
          : undefined,
        loyaltyPointsAmount: formState.loyaltyPointsAmount
          ? Number(formState.loyaltyPointsAmount)
          : undefined,
        // Convert empty strings to undefined for relational IDs
        supplierId: formState.supplierId || undefined,
        productTypeId: formState.productTypeId || undefined,
        typePcbId: formState.typePcbId || undefined,
        productStatusId: formState.productStatusId || undefined,
        taxId: formState.taxId || undefined,
        promotionId: formState.promotionId || undefined,
      };

      const productResponse = await onCreate(payload);

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
      );
      console.error("Error details:", error);
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-scroll rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          Create New Product
        </h2>

        <div className="grid grid-cols-1 gap-6 divide-y divide-gray-200 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4 pb-6 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Product Name *"
                value={formState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="rounded-lg border p-3"
              />
              <input
                type="text"
                placeholder="Bar Code *"
                value={formState.barcode}
                onChange={(e) => handleInputChange("barcode", e.target.value)}
                className="rounded-lg border p-3"
              />
              <input
                type="text"
                placeholder="SKU *"
                value={formState.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className="rounded-lg border p-3"
              />
            </div>
            <textarea
              placeholder="Description"
              value={formState.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full rounded-lg border p-3"
              rows={3}
            />
          </div>
          {/* Specifications */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Specifications
            </h3>
            <input
              type="text"
              placeholder="PCB"
              value={formState.pcb}
              onChange={(e) => handleInputChange("pcb", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="number"
              placeholder="Weight"
              value={formState.weight || ""}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="number"
              placeholder="Min Quantity"
              value={formState.minimumQte || ""}
              onChange={(e) => handleInputChange("minimumQte", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="number"
              placeholder="Max Quantity"
              value={formState.maximumQte || ""}
              onChange={(e) => handleInputChange("maximumQte", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="number"
              placeholder="Sealable "
              value={formState.sealable || ""}
              onChange={(e) => handleInputChange("sealable", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="number"
              placeholder="Alert Qte"
              value={formState.alertQte || ""}
              onChange={(e) => handleInputChange("alertQte", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Pricing & Stock
            </h3>
            <input
              type="number"
              placeholder="Price *"
              value={formState.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="number"
              placeholder="Cost"
              value={formState.cost || ""}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="number"
              placeholder="Stock"
              value={formState.stock || ""}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              className="w-full rounded-lg border p-3"
            />

            {/* Loyalty Program */}
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-semibold text-primary">
                Loyalty Program
              </h3>
              <input
                type="number"
                placeholder="Loyalty Points"
                value={formState.loyaltyPoints || ""}
                onChange={(e) =>
                  handleInputChange("loyaltyPoints", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
              <input
                type="number"
                placeholder="Loyalty Points Amount"
                value={formState.loyaltyPointsAmount || ""}
                onChange={(e) =>
                  handleInputChange("loyaltyPointsAmount", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          {/* Relationships */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Relationships
            </h3>
            <select
              value={formState.supplierId}
              onChange={(e) => handleInputChange("supplierId", e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.companyName}
                </option>
              ))}
            </select>

            <select
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

            <select
              value={formState.productTypeId || ""}
              onChange={(e) =>
                handleInputChange("productTypeId", e.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="">PCB Type</option>
              {typePcbs.map((pcb) => (
                <option key={pcb.id} value={pcb.id}>
                  {pcb.name}
                </option>
              ))}
            </select>

            <select
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

            <select
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
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-5 py-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
