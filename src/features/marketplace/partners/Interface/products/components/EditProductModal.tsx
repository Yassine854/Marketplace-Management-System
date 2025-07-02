import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useProductActions } from "../hooks/useProductActions";

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
  sealable?: number;
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

  const { updateSkuPartner } = useProductActions();

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
    // Required field validations for stock management
    if (!stocks || stocks.length === 0) {
      toast.error("At least one stock entry is required");
      setIsLoading(false);
      return;
    }
    const hasValidStock = (stocks || []).some(
      (stock) =>
        stock.sourceId &&
        stock.sourceId.trim() &&
        stock.price &&
        Number(stock.price) > 0 &&
        stock.special_price !== undefined &&
        stock.special_price !== null &&
        String(stock.special_price).trim() !== "" &&
        stock.stockQuantity !== undefined &&
        stock.stockQuantity !== null &&
        String(stock.stockQuantity).trim() !== "" &&
        stock.minQty !== undefined &&
        stock.minQty !== null &&
        String(stock.minQty).trim() !== "" &&
        stock.maxQty !== undefined &&
        stock.maxQty !== null &&
        String(stock.maxQty).trim() !== "",
    );
    if (!hasValidStock) {
      toast.error(
        "At least one stock entry must have all fields filled: Source, Price, Special Price, Stock Qty, Min Qty, Max Qty",
      );
      setIsLoading(false);
      return;
    }

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

          const response = await fetch("/api/marketplace/sku_partner/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            let errorMessage = "Failed to create SKU partner";
            try {
              const errorData = await response.json();
              errorMessage =
                errorData.message || errorData.error || errorMessage;
            } catch (jsonError) {
              // If response is not JSON (e.g., HTML error page)
              const textError = await response.text();
              console.error("Non-JSON response:", textError);
              errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
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
            let errorMessage = "Failed to update SKU partner";
            try {
              const errorData = await response.json();
              errorMessage =
                errorData.message || errorData.error || errorMessage;
            } catch (jsonError) {
              // If response is not JSON (e.g., HTML error page)
              const textError = await response.text();
              console.error("Non-JSON response:", textError);
              errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }
        }

        // Now handle stocks if we have a SKU partner ID
        if (skuPartnerId) {
          // Handle new stocks (those without an id)
          const newStocks = stocks.filter((stock) => !stock.id);
          for (const stock of newStocks) {
            try {
              const response = await fetch("/api/marketplace/stock/create", {
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
                let errorMessage = "Failed to create stock";
                try {
                  const errorData = await response.json();
                  errorMessage =
                    errorData.message || errorData.error || errorMessage;
                } catch (jsonError) {
                  // If response is not JSON (e.g., HTML error page)
                  const textError = await response.text();
                  console.error("Non-JSON response:", textError);
                  errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
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
                let errorMessage = "Failed to update stock";
                try {
                  const errorData = await response.json();
                  errorMessage =
                    errorData.message || errorData.error || errorMessage;
                } catch (jsonError) {
                  // If response is not JSON (e.g., HTML error page)
                  const textError = await response.text();
                  console.error("Non-JSON response:", textError);
                  errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
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
            Basic Information
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
              activeTab === "stock"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("stock")}
          >
            Stock Management
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
            <div className="pb-6">
              <h3 className="mb-4 text-xl font-semibold text-primary">
                Basic Information
              </h3>
              <div className="rounded-xl border bg-gray-50 p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Bar Code
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.barcode || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      SKU
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.sku || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Product Name
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.name || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Price
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.price ?? "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Weight
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.weight ?? "-"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Description
                    </div>
                    <div className="whitespace-pre-line text-lg font-medium text-gray-800">
                      {formState.description || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Relationships */}
          {activeTab === "relations" && (
            <div className="pt-15">
              <h3 className="mb-4 text-xl font-semibold text-primary">
                Relationships
              </h3>
              <div className="rounded-xl border bg-gray-50 p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Manufacturer
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {suppliers.find((s) => s.id === formState.supplierId)
                        ?.companyName || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Product Type
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {productTypes.find(
                        (t) => t.id === formState.productTypeId,
                      )?.type || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      PCB Type
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {typePcbs.find((p) => p.id === formState.typePcbId)
                        ?.name || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Product Status
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {productStatuses.find(
                        (s) => s.id === formState.productStatusId,
                      )?.name || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Tax
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {taxes.find((t) => t.id === formState.taxId)?.value ||
                        "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Sub-Categories
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.subCategories.length > 0
                        ? formState.subCategories
                            .map(
                              (id) =>
                                subCategories.find((sc) => sc.id === id)
                                  ?.name || id,
                            )
                            .join(", ")
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Related Products
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.relatedProducts.length > 0
                        ? formState.relatedProducts
                            .map(
                              (id) =>
                                relatedProducts.find((rp) => rp.id === id)
                                  ?.name || id,
                            )
                            .join(", ")
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Promotion
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {formState.promo ? "Yes" : "No"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                      Brand
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      {product.brand?.img && (
                        <img
                          src={product.brand.img}
                          alt="Brand Logo"
                          className="h-10 w-10 rounded border object-cover"
                        />
                      )}
                      <span className="text-lg font-medium text-gray-800">
                        {product.brand?.name || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Management */}
          {activeTab === "stock" && isPartner && (
            <div className="pt-15 space-y-4 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary">
                Stock Management
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
                      onBlur={async (e) => {
                        if (
                          partnerSkuPartner?.id &&
                          e.target.value !== partnerSkuPartner.skuPartner
                        ) {
                          try {
                            await updateSkuPartner(partnerSkuPartner.id, {
                              skuPartner: e.target.value,
                            });
                          } catch (err) {
                            // toast handled in hook
                          }
                        }
                      }}
                      className="w-full rounded-lg border p-3"
                      placeholder="Your SKU code"
                    />
                  </div>
                </div>
                {stocks.map((stock, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-medium">Stock Entry #{index + 1}</h4>
                      <button
                        onClick={() => removeStock(index)}
                        className="rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label="Remove Stock Entry"
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
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
                      <div className="min-w-[120px] flex-1">
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
                      <div className="min-w-[120px] flex-1">
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
                          placeholder="Price"
                        />
                      </div>
                      <div className="min-w-[100px] flex-1">
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
                          placeholder="Special Price"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700">
                          Stock Qty
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
                          placeholder="Stock Quantity"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700">
                          Min Qty
                        </label>
                        <input
                          type="number"
                          value={stock.minQty}
                          onChange={(e) =>
                            handleStockChange(index, "minQty", e.target.value)
                          }
                          className="w-full rounded-lg border p-3"
                          placeholder="Min Qty"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700">
                          Max Qty
                        </label>
                        <input
                          type="number"
                          value={stock.maxQty}
                          onChange={(e) =>
                            handleStockChange(index, "maxQty", e.target.value)
                          }
                          className="w-full rounded-lg border p-3"
                          placeholder="Max Qty"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700">
                          Sealable
                        </label>
                        <input
                          type="number"
                          value={stock.sealable || 0}
                          disabled
                          className="w-full cursor-not-allowed rounded-lg border bg-gray-100 p-3 text-gray-500"
                          placeholder="Sealable"
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
                  + Add Stock Entry
                </button>
              </div>
            </div>
          )}

          {/* Images tab - smaller images */}
          {activeTab === "images" && (
            <div className="pt-15 space-y-4">
              <h3 className="text-xl font-semibold text-primary">Images</h3>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {existingImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square h-20 w-20 overflow-hidden rounded-lg border"
                  >
                    <img
                      src={image.url}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
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
