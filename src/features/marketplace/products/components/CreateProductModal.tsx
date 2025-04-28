import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Product {
  id: string;
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
  productSubCategories?: Array<{
    subcategoryId: string;
    subcategory: {
      id: string;
      name: string;
    };
  }>;
  relatedProducts?: Array<{
    relatedProductId: string;
    relatedProduct: {
      id: string;
      name: string;
    };
  }>;
}

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
    loyaltyPointsPerProduct: undefined as number | undefined,
    loyaltyPointsPerUnit: undefined as number | undefined,
    loyaltyPointsBonusQuantity: undefined as number | undefined,
    loyaltyPointsThresholdQty: undefined as number | undefined,
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

  const [skuSearch, setSkuSearch] = useState("");
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
        loyaltyPointsPerProduct: undefined,
        loyaltyPointsPerUnit: undefined,
        loyaltyPointsBonusQuantity: undefined,
        loyaltyPointsThresholdQty: undefined,
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

  useEffect(() => {
    const searchProducts = async () => {
      if (!skuSearch.trim()) {
        setMatchingProducts([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch("/api/marketplace/products/getAll");
        const data = await response.json();

        const matches = data.products.filter((product: Product) =>
          product.sku.toLowerCase().includes(skuSearch.toLowerCase()),
        );

        setMatchingProducts(matches);
      } catch (error) {
        console.error("Error searching products:", error);
        toast.error("Failed to search products");
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [skuSearch]);

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

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const lines = csvText.split("\n");
      if (lines.length < 2) return; // Need at least header and one data row

      const headers = lines[0].split(",").map((h) => h.trim());
      const values = lines[1].split(",").map((v) => v.trim());

      // Create a mapping of values
      const data = headers.reduce(
        (acc, header, index) => {
          acc[header] = values[index];
          return acc;
        },
        {} as Record<string, string>,
      );

      // Update form state based on CSV data
      setFormState((prev) => ({
        ...prev,
        name: data["name"] || prev.name,
        barcode: data["barcode"] || prev.barcode,
        sku: data["sku"] || prev.sku,
        price: Number(data["price"]) || prev.price,
        cost: Number(data["cost"]) || prev.cost,
        stock: Number(data["stock"]) || prev.stock,
        description: data["description"] || prev.description,
        pcb: data["pcb"] || prev.pcb,
        weight: Number(data["weight"]) || prev.weight,
        minimumQte: Number(data["minimumQte"]) || prev.minimumQte,
        maximumQte: Number(data["maximumQte"]) || prev.maximumQte,
        sealable: Number(data["sealable"]) || prev.sealable,
        alertQte: Number(data["alertQte"]) || prev.alertQte,
        loyaltyPointsPerProduct:
          Number(data["loyaltyPointsPerProduct"]) ||
          prev.loyaltyPointsPerProduct,
        loyaltyPointsPerUnit:
          Number(data["loyaltyPointsPerUnit"]) || prev.loyaltyPointsPerUnit,
        loyaltyPointsBonusQuantity:
          Number(data["loyaltyPointsBonusQuantity"]) ||
          prev.loyaltyPointsBonusQuantity,
        loyaltyPointsThresholdQty:
          Number(data["loyaltyPointsThresholdQty"]) ||
          prev.loyaltyPointsThresholdQty,
      }));
    };

    reader.readAsText(file);
  };

  const handleProductSelect = (product: Product) => {
    setFormState({
      ...formState,
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
      loyaltyPointsPerProduct: product.loyaltyPointsPerProduct,
      loyaltyPointsPerUnit: product.loyaltyPointsPerUnit,
      loyaltyPointsBonusQuantity: product.loyaltyPointsBonusQuantity,
      loyaltyPointsThresholdQty: product.loyaltyPointsThresholdQty,
      supplierId: product.supplierId || "",
      productTypeId: product.productTypeId || "",
      typePcbId: product.typePcbId || "",
      productStatusId: product.productStatusId || "",
      taxId: product.taxId || "",
      promotionId: product.promotionId || "",
      // Extract subcategory IDs from productSubCategories array
      subCategories: product.productSubCategories
        ? product.productSubCategories.map((psc) => psc.subcategoryId)
        : [],
      // Extract related product IDs from relatedProducts array
      relatedProducts: product.relatedProducts
        ? product.relatedProducts.map((rp) => rp.relatedProductId)
        : [],
    });
    setSkuSearch("");
    setMatchingProducts([]);
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
        loyaltyPointsPerProduct: formState.loyaltyPointsPerProduct
          ? Number(formState.loyaltyPointsPerProduct)
          : undefined,
        loyaltyPointsPerUnit: formState.loyaltyPointsPerUnit
          ? Number(formState.loyaltyPointsPerUnit)
          : undefined,
        loyaltyPointsBonusQuantity: formState.loyaltyPointsBonusQuantity
          ? Number(formState.loyaltyPointsBonusQuantity)
          : undefined,
        loyaltyPointsThresholdQty: formState.loyaltyPointsThresholdQty
          ? Number(formState.loyaltyPointsThresholdQty)
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
          {/* CSV Upload */}
          <div className="mb-6 md:col-span-2">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="rounded-lg border p-3"
              />
              <span className="text-sm text-gray-500">
                Upload CSV to auto-fill fields
              </span>
            </div>
          </div>
          {/* SKU Search */}
          <div className="mb-6 md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by SKU..."
                value={skuSearch}
                onChange={(e) => setSkuSearch(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
              {isSearching && (
                <span className="absolute right-3 top-3">Loading...</span>
              )}
              {matchingProducts.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
                  {matchingProducts.map((product) => (
                    <div
                      key={product.id}
                      className="cursor-pointer p-3 hover:bg-gray-100"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.sku} - {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Points Per Product
                </label>
                <input
                  type="number"
                  placeholder="Points Per Product"
                  value={formState.loyaltyPointsPerProduct || ""}
                  onChange={(e) =>
                    handleInputChange("loyaltyPointsPerProduct", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Points Per Unit
                </label>
                <input
                  type="number"
                  placeholder="Points Per Unit"
                  value={formState.loyaltyPointsPerUnit || ""}
                  onChange={(e) =>
                    handleInputChange("loyaltyPointsPerUnit", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bonus Quantity
                </label>
                <input
                  type="number"
                  placeholder="Bonus Quantity"
                  value={formState.loyaltyPointsBonusQuantity || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "loyaltyPointsBonusQuantity",
                      e.target.value,
                    )
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Threshold Quantity
                </label>
                <input
                  type="number"
                  placeholder="Threshold Quantity"
                  value={formState.loyaltyPointsThresholdQty || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "loyaltyPointsThresholdQty",
                      e.target.value,
                    )
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
            <select
              value={formState.supplierId}
              onChange={(e) => handleInputChange("supplierId", e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select Manufacturer</option>
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
