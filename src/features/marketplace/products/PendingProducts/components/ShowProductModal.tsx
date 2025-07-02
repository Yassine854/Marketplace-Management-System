import { useState, useEffect } from "react";

interface SkuPartner {
  id: string;
  partnerId: string;
  skuPartner: string;
  productId: string;
}

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  barcode?: string;
  sku: string;
  price: number;
  special_price?: number;
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
  promo: boolean;
  activities: string[];
  images: ProductImage[];
  productSubCategories: any[];
  relatedProducts: any[];
  brand?: {
    id: string;
    img: string;
    name: string | null;
  };
}

interface ShowProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
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

const ShowProductModal = ({
  isOpen,
  onClose,
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
  skuPartners,
}: ShowProductModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    if (product && isOpen) {
      setExistingImages(product.images || []);
      setActiveTab("basic");
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Helper functions to get related entity names
  const getSupplierName = () => {
    if (!product.supplierId) return "N/A";
    const supplier = suppliers.find((s) => s.id === product.supplierId);
    return supplier ? supplier.companyName : "N/A";
  };

  const getProductTypeName = () => {
    if (!product.productTypeId) return "N/A";
    const type = productTypes.find((t) => t.id === product.productTypeId);
    return type ? type.type : "N/A";
  };

  const getTypePcbName = () => {
    if (!product.typePcbId) return "N/A";
    const pcb = typePcbs.find((p) => p.id === product.typePcbId);
    return pcb ? pcb.name : "N/A";
  };

  const getStatusName = () => {
    if (!product.productStatusId) return "N/A";
    const status = productStatuses.find(
      (s) => s.id === product.productStatusId,
    );
    return status ? status.name : "N/A";
  };

  const getTaxValue = () => {
    if (!product.taxId) return "N/A";
    const tax = taxes.find((t) => t.id === product.taxId);
    return tax ? tax.value : "N/A";
  };

  const getPromotionPrice = () => {
    if (!product.promotionId) return "N/A";
    const promotion = promotions.find((p) => p.id === product.promotionId);
    return promotion ? promotion.promoPrice : "N/A";
  };

  const getRelatedProductName = (relatedProductId: string) => {
    if (!relatedProductId) return "";
    const related = relatedProducts.find((r) => r.id === relatedProductId);
    return related ? related.name : "";
  };

  const displayValue = (value: any) => {
    return value || ""; // Return empty string instead of "N/A"
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-[76px] z-10 flex w-full overflow-x-auto border-b bg-white px-6">
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "basic"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "specs"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "pricing"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pricing")}
          >
            Pricing & Stock
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "relations"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("relations")}
          >
            Relationships
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "partners"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("partners")}
          >
            Partner SKUs
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "images"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("images")}
          >
            Images
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="p-6">
          {/* Basic Information */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.name || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Barcode
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.barcode || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.sku || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="min-h-[72px] w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.description || "No description available"}
                </div>
              </div>
            </div>
          )}

          {/* Specifications */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  PCB
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.pcb || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Weight (g)
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.weight || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Minimum Quantity
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.minimumQte || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Maximum Quantity
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.maximumQte || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Alert Quantity
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.alertQte || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sealable
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {displayValue(product.sealable)}
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Stock */}
          {activeTab === "pricing" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.price ? `${product.price.toFixed(2)} DT` : "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Special Price
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.special_price
                    ? `${product.special_price.toFixed(2)} DT`
                    : "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Cost
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.cost ? `${product.cost.toFixed(2)} DT` : "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.stock || "N/A"}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Promotional
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {product.promo ? "Yes" : "No"}
                </div>
              </div>

              {product.promo && (
                <div className="form-group">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Promotion
                  </label>
                  <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                    {getPromotionPrice()}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tax
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {getTaxValue()}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Loyalty Points Per Product
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {displayValue(product.loyaltyPointsPerProduct)}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Loyalty Points Per Unit
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {displayValue(product.loyaltyPointsPerUnit)}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Loyalty Points Bonus Quantity
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {displayValue(product.loyaltyPointsBonusQuantity)}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Loyalty Points Threshold Quantity
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {displayValue(product.loyaltyPointsThresholdQty)}
                </div>
              </div>
            </div>
          )}

          {/* Relationships */}
          {activeTab === "relations" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {getSupplierName()}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Product Type
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {getProductTypeName()}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  PCB Type
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {getTypePcbName()}
                </div>
              </div>

              <div className="form-group">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="w-full rounded-lg border bg-gray-50 p-2 text-gray-700">
                  {getStatusName()}
                </div>
              </div>

              <div className="col-span-full">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sub Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.productSubCategories &&
                  product.productSubCategories.length > 0 ? (
                    product.productSubCategories.map((sc: any) => {
                      const subCategory = subCategories.find(
                        (s) => s.id === sc.subcategoryId,
                      );
                      return (
                        <span
                          key={sc.subcategoryId}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                        >
                          {subCategory?.name || "Unknown"}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500">No sub-categories</span>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Related Products
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.relatedProducts &&
                  product.relatedProducts.length > 0 ? (
                    product.relatedProducts.map((rp: any) => {
                      // Log the structure to debug

                      // Try different ways to access the related product
                      const relatedProduct = relatedProducts.find(
                        (r) => r.id === rp.relatedProductId,
                      );
                      const name =
                        relatedProduct?.name ||
                        rp.relatedProduct?.name ||
                        getRelatedProductName(rp.relatedProductId) ||
                        "";

                      return (
                        <span
                          key={rp.relatedProductId}
                          className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                        >
                          {name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500">No related products</span>
                  )}
                </div>
              </div>

              {/* Brand Information - Simple Layout */}
              <div className="col-span-full mt-6">
                <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
                  {product.brand?.img && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={product.brand.img}
                        alt="Brand Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Brand</h4>
                    <div className="text-base text-gray-900">
                      {product.brand?.name || "Not specified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Partner SKUs */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Partner SKUs
              </h3>
              {skuPartners && skuPartners.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Partner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Partner SKU
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {skuPartners.map((sp) => {
                        const partner = partners.find(
                          (p) => p.id === sp.partnerId,
                        );
                        return (
                          <tr key={sp.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {partner?.username || "Unknown"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {sp.skuPartner ||
                                (product && product.sku) ||
                                "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">
                  No partner SKUs defined for this product
                </p>
              )}
            </div>
          )}

          {/* Images */}
          {activeTab === "images" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Product Images
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {existingImages.length > 0 ? (
                  existingImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={image.url}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with close button */}
        <div className="sticky bottom-0 flex justify-end gap-4 border-t bg-white p-6">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-5 py-2 text-white hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowProductModal;
