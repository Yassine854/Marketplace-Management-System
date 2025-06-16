import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

// Add Stock interface
interface Stock {
  id?: string;
  sourceId: string;
  stockQuantity: number;
  minQty: number;
  maxQty: number;
  price: number;
  special_price: number;
  loyaltyPointsPerProduct?: number;
  loyaltyPointsPerUnit?: number;
  loyaltyPointsBonusQuantity?: number;
  loyaltyPointsThresholdQty?: number;
  source?: {
    id: string;
    name: string;
  };
}

interface SkuPartner {
  id?: string;
  partnerId: string;
  skuPartner: string;
  stock?: Stock[];
}

// Add Source interface
interface Source {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  url: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: any) => Promise<void>;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    special_price?: number;
    barcode?: string;
    pcb?: string;
    weight?: number;
    description?: string;
    stock?: number;
    promo: boolean;
    minimumQte?: number;
    maximumQte?: number;
    sealable?: number;
    alertQte?: number;
    loyaltyPointsPerProduct?: number;
    loyaltyPointsPerUnit?: number;
    loyaltyPointsBonusQuantity?: number;
    loyaltyPointsThresholdQty?: number;
    supplierId?: string | null;
    productTypeId?: string | null;
    typePcbId?: string | null;
    productStatusId?: string | null;
    taxId?: string | null;
    promotionId?: string | null;
    activities: string[];
    images: ProductImage[];
    productSubCategories: any[];
    relatedProducts: any[];
    cost?: number;
    brand?: {
      id: string;
      img: string;
      name: string | null;
      productId: string;
    };
  };
  suppliers: Array<{ id: string; companyName: string }>;
  productTypes: Array<{ id: string; type: string }>;
  typePcbs: Array<{ id: string; name: string }>;
  productStatuses: Array<{ id: string; name: string }>;
  subCategories: Array<{ id: string; name: string }>;
  relatedProducts: Array<{ id: string; name: string }>;
  taxes: Array<{ id: string; value: string }>;
  promotions: Array<{ id: string; promoPrice: string }>;
  skuPartners: SkuPartner[];
  sources: Array<{ id: string; name: string }>;
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
  skuPartners: initialSkuPartners,
  sources: initialSources,
}: EditProductModalProps) => {
  // Add session to get current user
  const { data: session } = useSession();
  const [partnerSkuPartner, setPartnerSkuPartner] = useState<SkuPartner | null>(
    null,
  );
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

  // Get user info from session
  const user = session?.user as
    | {
        id: string;
        roleId?: string;
        mRoleId?: string;
        userType?: string;
      }
    | undefined;

  const isPartner = user?.userType === "partner";
  const partnerId = isPartner ? user.id : null;

  // useEffect to find the partner's SKU partner and fetch stocks
  useEffect(() => {
    if (product && isOpen && isPartner && partnerId) {
      // Find the SKU partner that belongs to the logged-in partner
      const partnerSku = initialSkuPartners.find(
        (sp) => sp.partnerId === partnerId,
      );
      setPartnerSkuPartner(partnerSku || null);

      // Fetch stocks if we have a SKU partner
      const fetchStocks = async () => {
        if (partnerSku?.id) {
          try {
            const response = await fetch("/api/marketplace/stock/getAll");
            if (response.ok) {
              const data = await response.json();
              // Filter stocks for this SKU partner
              const partnerStocks = data.stocks.filter(
                (stock: any) => stock.skuPartnerId === partnerSku.id,
              );
              setStocks(partnerStocks || []);
            }
          } catch (error) {
            console.error("Error fetching stocks:", error);
            toast.error("Failed to load stocks");
          }
        }
      };

      fetchStocks();
    }
  }, [product, isOpen, initialSkuPartners, partnerId, isPartner]);

  // Add function to handle stock changes
  const handleStockChange = (index: number, field: string, value: any) => {
    const updatedStocks = [...stocks];
    updatedStocks[index] = {
      ...updatedStocks[index],
      [field]: field === "sourceId" ? value : Number(value),
    };
    setStocks(updatedStocks);
  };

  // Add function to add a new stock
  const addStock = () => {
    if (!partnerSkuPartner?.id) {
      toast.error("You need to save your SKU first before adding stock");
      return;
    }

    setStocks([
      ...stocks,
      {
        sourceId: "",
        stockQuantity: 0,
        minQty: 0,
        maxQty: 0,
        price: 0,
        special_price: 0,
        loyaltyPointsPerProduct: undefined,
        loyaltyPointsPerUnit: undefined,
        loyaltyPointsBonusQuantity: undefined,
        loyaltyPointsThresholdQty: undefined,
      },
    ]);
  };

  // Add a function to remove stock
  const removeStock = async (index: number) => {
    const stockToRemove = stocks[index];

    // If the stock has an ID, it exists in the database and needs to be deleted via API
    if (stockToRemove.id) {
      try {
        const response = await fetch(
          `/api/marketplace/stock/${stockToRemove.id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          toast.success("Stock deleted successfully");
        } else {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete stock");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete stock",
        );
        return; // Don't remove from UI if API call failed
      }
    }

    // Remove from UI
    const updatedStocks = [...stocks];
    updatedStocks.splice(index, 1);
    setStocks(updatedStocks);
  };

  const [formState, setFormState] = useState({
    name: "",
    barcode: "" as string | undefined,
    sku: "",
    price: 0,
    special_price: undefined as number | undefined,
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
    supplierId: "" as string | null,
    productTypeId: "" as string | null,
    typePcbId: "" as string | null,
    productStatusId: "" as string | null,
    taxId: "" as string | null,
    promotionId: "" as string | null,
    subCategories: [] as string[],
    relatedProducts: [] as string[],
    promo: false,
    images: [] as File[],
  });

  const [skuPartners, setSkuPartners] = useState<SkuPartner[]>([]);
  // Removed duplicate isLoading state
  // const [isLoading, setIsLoading] = useState(false);
  // Removed duplicate existingImages state
  // const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  // Removed duplicate activeTab state
  // const [activeTab, setActiveTab] = useState("basic");

  // Removed duplicate stocks and partnerSkuPartner states
  // const [partnerSkuPartner, setPartnerSkuPartner] = useState<SkuPartner | null>(null);
  // const [stocks, setStocks] = useState<Stock[]>([]);
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    if (product && isOpen) {
      setExistingImages(product.images || []);

      setFormState({
        name: product.name,
        barcode: product.barcode,
        sku: product.sku,
        price: product.price,
        special_price: product.special_price,
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

      // Process SKU prtners to ensure price is correctly handled
      const processedSkuPartners = initialSkuPartners.map((sp) => {
        let priceValue = 0;

        return {
          id: sp.id,
          partnerId: sp.partnerId,
          skuPartner: sp.skuPartner,
        };
      });

      setSkuPartners(processedSkuPartners);
      setActiveTab("basic");
    }
  }, [product, isOpen, initialSkuPartners]);

  // Add this useEffect to reset loading state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false); // Reset loading state when modal opens
    }
  }, [isOpen]);

  const handleImageUpload = async (files: File[]) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("images", file); // Changed from "file" to "images" to match API
      formData.append("productId", product.id); // Add the productId

      const response = await fetch("/api/marketplace/image/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Image upload error:", errorData);
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      // The API returns an array of image URLs, but we need the image objects with id and url
      // Let's handle this properly
      if (data.images && data.images.length > 0) {
        return { id: data.id || "temp-id", url: data.images[0] };
      } else {
        throw new Error("No image URL returned from server");
      }
    });

    return Promise.all(uploadPromises);
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

  const handleSkuPartnerChange = (index: number, field: string, value: any) => {
    const updatedPartners = [...skuPartners];

    // Only allow updating the skuPartner field
    if (field === "skuPartner") {
      updatedPartners[index] = {
        ...updatedPartners[index],
        skuPartner: value,
      };

      setSkuPartners(updatedPartners);
    }
  };

  const addSkuPartner = () => {
    setSkuPartners([
      ...skuPartners,
      {
        partnerId: "",
        skuPartner: "",
      },
    ]);
  };

  const removeSkuPartner = async (index: number) => {
    const partnerToRemove = skuPartners[index];

    // If the partner has an ID, it exists in the database and needs to be deleted via API
    if (partnerToRemove.id) {
      try {
        const response = await fetch(
          `/api/marketplace/sku_partner/${partnerToRemove.id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          toast.success("Partner SKU deleted successfully");
        } else {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete partner SKU");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete partner SKU",
        );
        return; // Don't remove from UI if API call failed
      }
    }

    // Remove from UI
    const updatedPartners = [...skuPartners];
    updatedPartners.splice(index, 1);
    setSkuPartners(updatedPartners);
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/marketplace/image/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete image");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete image",
      );
    }
  };

  const handleClose = () => {
    setIsLoading(false); // Reset loading state when modal closes
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Only update the partner SKU and stocks
      if (partnerId) {
        // First, update or create the SKU partner
        let skuPartnerId = partnerSkuPartner?.id;

        if (!skuPartnerId && partnerSkuPartner) {
          // Create new SKU partner if it doesn't exist
          const payload = {
            partnerId: partnerId,
            skuPartner: partnerSkuPartner.skuPartner?.trim() || formState.sku,
            skuProduct: formState.sku,
            productId: product?.id,
          };

          const response = await fetch("/api/marketplace/sku_partner", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to create SKU partner",
            );
          }

          const data = await response.json();
          skuPartnerId = data.id;

          // Update the partnerSkuPartner state with the new ID
          setPartnerSkuPartner({
            ...partnerSkuPartner,
            id: skuPartnerId,
          });
        } else if (skuPartnerId && partnerSkuPartner) {
          // Update existing SKU partner
          const payload = {
            partnerId: partnerId,
            skuPartner: partnerSkuPartner.skuPartner?.trim() || formState.sku,
            skuProduct: formState.sku,
            productId: product?.id,
          };

          const response = await fetch(
            `/api/marketplace/sku_partner/${skuPartnerId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to update SKU partner",
            );
          }
        }

        // Now handle stocks if we have a SKU partner ID
        if (skuPartnerId) {
          // Handle new stocks (those without an id)
          const newStocks = stocks.filter((stock) => !stock.id);
          for (const stock of newStocks) {
            try {
              const response = await fetch("/api/marketplace/stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  skuPartnerId: skuPartnerId,
                  sourceId: stock.sourceId,
                  stockQuantity: Number(stock.stockQuantity),
                  minQty: Number(stock.minQty),
                  maxQty: Number(stock.maxQty),
                  price: Number(stock.price),
                  special_price: Number(stock.special_price),
                  loyaltyPointsPerProduct: stock.loyaltyPointsPerProduct,
                  loyaltyPointsPerUnit: stock.loyaltyPointsPerUnit,
                  loyaltyPointsBonusQuantity: stock.loyaltyPointsBonusQuantity,
                  loyaltyPointsThresholdQty: stock.loyaltyPointsThresholdQty,
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create stock");
              }
            } catch (stockError) {
              console.error("Error creating stock:", stockError);
              toast.error(
                stockError instanceof Error
                  ? stockError.message
                  : "Failed to create stock",
              );
            }
          }

          // Handle existing stocks (those with an id)
          const existingStocks = stocks.filter((stock) => stock.id);
          for (const stock of existingStocks) {
            try {
              const response = await fetch(
                `/api/marketplace/stock/${stock.id}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    skuPartnerId: skuPartnerId,
                    sourceId: stock.sourceId,
                    stockQuantity: Number(stock.stockQuantity),
                    special_price: Number(stock.special_price),
                    minQty: Number(stock.minQty),
                    maxQty: Number(stock.maxQty),
                    price: Number(stock.price),
                    loyaltyPointsPerProduct: stock.loyaltyPointsPerProduct,
                    loyaltyPointsPerUnit: stock.loyaltyPointsPerUnit,
                    loyaltyPointsBonusQuantity:
                      stock.loyaltyPointsBonusQuantity,
                    loyaltyPointsThresholdQty: stock.loyaltyPointsThresholdQty,
                  }),
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.message ||
                    errorData.error ||
                    "Failed to update stock",
                );
              }
            } catch (stockError) {
              console.error("Error updating stock:", stockError);
              toast.error(
                stockError instanceof Error
                  ? stockError.message
                  : "Failed to update stock",
              );
            }
          }
        }

        toast.success("Product information updated successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Add a function to get available sources (not already selected)
  const getAvailableSources = (currentStockId?: string) => {
    // Get all source IDs that are already selected in other stocks
    const selectedSourceIds = stocks
      .filter((stock) => stock.id !== currentStockId) // Exclude current stock
      .map((stock) => stock.sourceId)
      .filter(Boolean); // Filter out empty strings or undefined

    // Return only sources that haven't been selected yet
    return initialSources.filter(
      (source) => !selectedSourceIds.includes(source.id),
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <button
            onClick={handleClose}
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

        {/* Tabs - Fixed position and full width */}
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

        <div className="p-6">
          {/* Basic Information */}
          {activeTab === "basic" && (
            <div className="space-y-4 pb-6">
              <h3 className="text-xl font-semibold text-primary">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={formState.name}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bar Code
                  </label>
                  <input
                    type="text"
                    placeholder="Bar Code"
                    value={formState.barcode || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    placeholder="SKU"
                    value={formState.sku}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  value={formState.description}
                  disabled
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Specifications - ensure all fields are disabled */}
          {activeTab === "specs" && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-semibold text-primary">
                Specifications
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PCB
                  </label>
                  <input
                    type="text"
                    placeholder="PCB"
                    value={formState.pcb || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight
                  </label>
                  <input
                    type="number"
                    placeholder="Weight"
                    value={formState.weight || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Minimum Quantity"
                    value={formState.minimumQte || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Maximum Quantity"
                    value={formState.maximumQte || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sealable
                  </label>
                  <input
                    type="number"
                    placeholder="Sealable"
                    value={formState.sealable || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Alert Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Alert Quantity"
                    value={formState.alertQte || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Stock - all fields disabled */}
          {activeTab === "pricing" && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-semibold text-primary">
                Pricing & Stock
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price *
                  </label>
                  <input
                    type="number"
                    placeholder="Price *"
                    value={formState.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Price
                  </label>
                  <input
                    type="number"
                    placeholder="Special Price"
                    value={formState.special_price || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cost
                  </label>
                  <input
                    type="number"
                    placeholder="Cost"
                    value={formState.cost || ""}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={formState.stock || ""}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  />
                </div>
              </div>

              {/* Loyalty Program */}
              <div className="pt-4">
                <h4 className="mb-3 text-lg font-medium text-gray-800">
                  Loyalty Program
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Points Per Product
                    </label>
                    <input
                      type="number"
                      placeholder="Points Per Product"
                      value={formState.loyaltyPointsPerProduct || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "loyaltyPointsPerProduct",
                          e.target.value,
                        )
                      }
                      disabled
                      className="w-full rounded-lg border bg-gray-100 p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Points Per Unit
                    </label>
                    <input
                      type="number"
                      placeholder="Points Per Unit"
                      value={formState.loyaltyPointsPerUnit || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "loyaltyPointsPerUnit",
                          e.target.value,
                        )
                      }
                      disabled
                      className="w-full rounded-lg border bg-gray-100 p-3"
                    />
                  </div>
                  <div>
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
                      disabled
                      className="w-full rounded-lg border bg-gray-100 p-3"
                    />
                  </div>
                  <div>
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
                      disabled
                      className="w-full rounded-lg border bg-gray-100 p-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Relationships - all fields disabled */}
          {activeTab === "relations" && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-semibold text-primary">
                Relationships
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Manufacturer
                  </label>
                  <select
                    value={formState.supplierId || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  >
                    <option value="">Select Manufacturer</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Type
                  </label>
                  <select
                    value={formState.productTypeId || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  >
                    <option value="">Select Product Type</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PCB Type
                  </label>
                  <select
                    value={formState.typePcbId || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  >
                    <option value="">Select PCB Type</option>
                    {typePcbs.map((pcb) => (
                      <option key={pcb.id} value={pcb.id}>
                        {pcb.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Status
                  </label>
                  <select
                    value={formState.productStatusId || ""}
                    disabled
                    className="w-full rounded-lg border bg-gray-100 p-3"
                  >
                    <option value="">Select Product Status</option>
                    {productStatuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rest of the relationships tab content */}
              <div className="pt-4">
                <h4 className="mb-3 text-lg font-medium text-gray-800">
                  Sub-categories
                </h4>
                <select
                  multiple
                  value={formState.subCategories}
                  disabled
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  size={4}
                >
                  {subCategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Related Products - disabled */}
              <div className="pt-4">
                <h4 className="mb-3 text-lg font-medium text-gray-800">
                  Related Products
                </h4>
                <select
                  multiple
                  value={formState.relatedProducts}
                  disabled
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  size={4}
                >
                  {relatedProducts.map((rp) => (
                    <option key={rp.id} value={rp.id}>
                      {rp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tax - disabled */}
              <div className="pt-4">
                <h4 className="mb-3 text-lg font-medium text-gray-800">Tax</h4>
                <select
                  value={formState.taxId || ""}
                  disabled
                  className="w-full rounded-lg border bg-gray-100 p-3"
                >
                  <option value="">Select Tax</option>
                  {taxes.map((tax) => (
                    <option key={tax.id} value={tax.id}>
                      {tax.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Promotion - disabled */}
              <div className="pt-4">
                <h4 className="mb-3 text-lg font-medium text-gray-800">
                  Promotion
                </h4>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formState.promo}
                    disabled
                    className="h-5 w-5 bg-gray-100"
                  />
                  <span>Promo Product</span>
                </label>
                {formState.promo && (
                  <select
                    value={formState.promotionId || ""}
                    disabled
                    className="mt-2 w-full rounded-lg border bg-gray-100 p-3"
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

              {/* Brand Information - Read Only */}
              <div className="mt-6 rounded-lg border border-gray-200 p-4">
                <h4 className="mb-4 text-lg font-medium text-gray-800">
                  Brand Information
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={product.brand?.name || ""}
                      disabled
                      className="w-full rounded-lg border bg-gray-100 p-3"
                    />
                  </div>
                  {product.brand?.img && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Brand Logo
                      </label>
                      <div className="mt-2 h-24 w-24 overflow-hidden rounded-lg border">
                        <img
                          src={product.brand.img}
                          alt="Brand Logo"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Partner SKUs */}
          {activeTab === "partners" && isPartner && (
            <div className="space-y-4 pt-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary">
                Partner SKU
              </h3>

              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your SKU
                    </label>
                    <input
                      type="text"
                      value={partnerSkuPartner?.skuPartner || ""}
                      onChange={(e) =>
                        setPartnerSkuPartner({
                          ...(partnerSkuPartner || {
                            partnerId: partnerId || "",
                          }),
                          skuPartner: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-3"
                      placeholder="Your SKU code"
                    />
                  </div>
                </div>

                <h3 className="mt-6 text-xl font-semibold text-primary">
                  Stock Management
                </h3>

                {stocks.map((stock, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border border-gray-200 p-4"
                  >
                    <div className="absolute right-2 top-2">
                      <button
                        type="button"
                        onClick={() => removeStock(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove stock"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Source
                        </label>
                        <select
                          value={stock.sourceId}
                          onChange={(e) =>
                            handleStockChange(index, "sourceId", e.target.value)
                          }
                          className="w-full rounded-lg border p-3"
                        >
                          <option value="">Select Source</option>
                          {getAvailableSources(stock.id).map((source) => (
                            <option key={source.id} value={source.id}>
                              {source.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          value={stock.price}
                          onChange={(e) =>
                            handleStockChange(index, "price", e.target.value)
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Special Price
                        </label>
                        <input
                          type="number"
                          value={stock.special_price}
                          onChange={(e) =>
                            handleStockChange(
                              index,
                              "special_price",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={stock.stockQuantity}
                          onChange={(e) =>
                            handleStockChange(
                              index,
                              "stockQuantity",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Minimum Quantity
                        </label>
                        <input
                          type="number"
                          value={stock.minQty}
                          onChange={(e) =>
                            handleStockChange(index, "minQty", e.target.value)
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Maximum Quantity
                        </label>
                        <input
                          type="number"
                          value={stock.maxQty}
                          onChange={(e) =>
                            handleStockChange(index, "maxQty", e.target.value)
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                        />
                      </div>

                      {/* Loyalty Points Fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Per Product
                        </label>
                        <input
                          type="number"
                          value={stock.loyaltyPointsPerProduct || ""}
                          onChange={(e) =>
                            handleStockChange(
                              index,
                              "loyaltyPointsPerProduct",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Per Unit
                        </label>
                        <input
                          type="number"
                          value={stock.loyaltyPointsPerUnit || ""}
                          onChange={(e) =>
                            handleStockChange(
                              index,
                              "loyaltyPointsPerUnit",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Bonus Quantity
                        </label>
                        <input
                          type="number"
                          value={stock.loyaltyPointsBonusQuantity || ""}
                          onChange={(e) =>
                            handleStockChange(
                              index,
                              "loyaltyPointsBonusQuantity",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Threshold Quantity
                        </label>
                        <input
                          type="number"
                          value={stock.loyaltyPointsThresholdQty || ""}
                          onChange={(e) =>
                            handleStockChange(
                              index,
                              "loyaltyPointsThresholdQty",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addStock}
                  className="w-full rounded-lg bg-gray-100 p-3 text-gray-700 hover:bg-gray-200"
                >
                  + Add Stock for New Source
                </button>
              </div>
            </div>
          )}

          {/* Images tab - disabled */}
          {activeTab === "images" && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-semibold text-primary">Images</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {existingImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <img
                      src={image.url}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                    {/* Remove delete button */}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <p className="text-gray-500">
                  Image uploads are disabled in partner mode
                </p>
              </div>
            </div>
          )}

          {/* Other form sections remain the same... */}
        </div>

        {/* Fixed footer with buttons */}
        <div className="sticky bottom-0 flex justify-end gap-4 border-t bg-white p-6">
          <button
            onClick={handleClose}
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
