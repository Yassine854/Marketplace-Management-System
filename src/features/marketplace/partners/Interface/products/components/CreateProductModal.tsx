import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Select from "react-select";
import { useSearchBar } from "@/features/shared/inputs/SearchBar/useSearchBar";
import { useCreateProduct } from "../hooks/useCreateProduct";

interface Product {
  id: string;
  name: string;
  barcode: string;
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
  brand?: {
    name: string | null;
  };
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
    brandName: string;
    brandImage: File | null;
  }) => Promise<any>;
  suppliers: Array<{ id: string; companyName: string }>;
  productTypes: Array<{ id: string; type: string }>;
  typePcbs: Array<{ id: string; name: string }>;
  productStatuses: Array<{ id: string; name: string }>;
  subCategories: Array<{ id: string; name: string }>;
  relatedProducts: Array<{ id: string; name: string }>;
  taxes: Array<{ id: string; value: string }>;
  promotions: Array<{ id: string; promoPrice: string }>;
  partners: Array<{ id: string; name: string }>;
}

const ACTIVITIES = [
  "alimentation générale",
  "fruits secs",
  "superette",
  "epics et salaisons",
  "vente volailles et dérivés",
  "patisserie",
  "boulangerie",
  "restaurant",
  "société",
  "vente legumes et fruits",
  "vente produits de parfumerie",
  "cce d'ecipes",
  "autre",
];

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
  partners,
}: CreateProductModalProps) => {
  const [formState, setFormState] = useState({
    name: "",
    barcode: "",
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
    partnerSku: "", // Single field for partner SKU
    stocks: [] as Array<{
      sourceId: string;
      stockQuantity: number;
      minQty: number;
      maxQty: number;
      price: number;
      special_price: number;
      sealable?: number;
      loyaltyPointsPerProduct?: number;
      loyaltyPointsPerUnit?: number;
      loyaltyPointsBonusQuantity?: number;
      loyaltyPointsThresholdQty?: number;
    }>,
    brandName: "",
    brandImage: null as File | null,
    activities: [] as string[],
    brandId: "" as string,
  });

  // Add this line to use the hook at the component level
  const { createProduct } = useCreateProduct();

  const [activeTab, setActiveTab] = useState("basic");

  // Add state for sources
  const [partnerSources, setPartnerSources] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add these state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add a state to store the selected product ID
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  // Add state for brands and loading
  const [brands, setBrands] = useState<
    Array<{ id: string; name: string | null; img: string }>
  >([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  // Fetch brands when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    setIsLoadingBrands(true);
    try {
      const response = await axios.get("/api/marketplace/brand/getAll");
      if (response.data && Array.isArray(response.data.brands)) {
        setBrands(response.data.brands);
      } else {
        setBrands([]);
      }
    } catch (error) {
      setBrands([]);
      toast.error("Failed to load brands");
    } finally {
      setIsLoadingBrands(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormState({
        name: "",
        barcode: "",
        sku: "",
        price: 0,
        special_price: undefined,
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
        partnerSku: "", // Single field for partner SKU
        stocks: [], // Empty array for stocks
        brandName: "",
        brandImage: null,
        activities: [],
        brandId: "",
      });
      setActiveTab("basic");
      setSelectedProductId(null); // Reset selected product ID
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

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        const dataLine = lines[1].split(",").map((d) => d.trim());

        const data: Record<string, string> = {};
        headers.forEach((header, index) => {
          data[header] = dataLine[index] || "";
        });

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

        toast.success("CSV data imported successfully");
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
      }
    };
    reader.readAsText(file);
  };

  const handlePartnerSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      partnerSku: e.target.value,
    }));
  };

  const handleStockChange = (stockIndex: number, field: string, value: any) => {
    const updatedStocks = [...formState.stocks];

    // Special handling for price field to ensure it's a float
    if (field === "price") {
      let floatValue = value === "" ? 0 : parseFloat(value);
      if (isNaN(floatValue)) floatValue = 0;
      updatedStocks[stockIndex] = {
        ...updatedStocks[stockIndex],
        [field]: floatValue,
      };
    } else if (field === "stockQuantity") {
      // When stockQuantity changes, also update sealable
      updatedStocks[stockIndex] = {
        ...updatedStocks[stockIndex],
        stockQuantity: value,
        sealable: value,
      };
    } else {
      updatedStocks[stockIndex] = {
        ...updatedStocks[stockIndex],
        [field]: value,
      };
    }

    setFormState((prev) => ({
      ...prev,
      stocks: updatedStocks,
    }));
  };

  // Add a function to get available sources (not already selected)
  const getAvailableSources = (currentIndex: number) => {
    // Get all source IDs that are already selected in other stocks
    const selectedSourceIds = formState.stocks
      .filter((_, i) => i !== currentIndex) // Exclude current stock
      .map((stock) => stock.sourceId)
      .filter(Boolean); // Filter out empty strings or undefined

    console.log("Selected source IDs:", selectedSourceIds);
    console.log("All partner sources:", partnerSources);

    // Return only sources that haven't been selected yet
    const availableSources = Array.isArray(partnerSources)
      ? partnerSources.filter(
          (source) => !selectedSourceIds.includes(source.id),
        )
      : [];

    console.log(
      "Available sources for index",
      currentIndex,
      ":",
      availableSources,
    );
    return availableSources;
  };
  const addStock = () => {
    setFormState((prev) => ({
      ...prev,
      stocks: [
        ...prev.stocks,
        {
          sourceId: "",
          stockQuantity: 0,
          minQty: 0,
          maxQty: 0,
          price: 0,
          special_price: 0,
          sealable: 0,
        },
      ],
    }));
  };

  const removeStock = (stockIndex: number) => {
    const updatedStocks = [...formState.stocks];
    updatedStocks.splice(stockIndex, 1);

    setFormState((prev) => ({
      ...prev,
      stocks: updatedStocks,
    }));
  };

  // Fetch sources when component mounts
  useEffect(() => {
    const fetchPartnerSources = async () => {
      try {
        const response = await axios.get(`/api/marketplace/source/getAll`);
        if (response.data && response.data.sources) {
          setPartnerSources(response.data.sources);
        }
      } catch (error) {
        console.error("Error fetching partner sources:", error);
        toast.error("Failed to load sources");
      }
    };

    fetchPartnerSources();
  }, []);

  // Simple function to search products by barcode or SKU
  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      // Use the dedicated search endpoint
      const response = await axios.get(
        `/api/marketplace/products/search?query=${encodeURIComponent(
          searchTerm,
        )}`,
      );

      if (response.data && Array.isArray(response.data.products)) {
        if (response.data.products.length > 0) {
          console.log("Search results:", response.data.products); // For debugging
          setSearchResults(response.data.products);
        } else {
          setSearchResults([]);
          toast.error("No products found with that barcode or SKU");
        }
      } else {
        setSearchResults([]);
        toast.error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Failed to search products");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to use a product's data in the form
  const selectProduct = (product: Product) => {
    console.log("Selected product:", product);

    // Store the selected product ID
    setSelectedProductId(product.id);

    // Extract subcategory IDs and related product IDs
    const subCategoryIds =
      product.productSubCategories?.map((sc) => sc.subcategoryId) || [];
    const relatedProductIds =
      product.relatedProducts?.map((rp) => rp.relatedProductId) || [];

    setFormState({
      name: product.name,
      barcode: product.barcode || "",
      sku: product.sku,
      price: product.price,
      special_price: product.special_price || undefined,
      cost: product.cost || 0,
      stock: product.stock || 0,
      description: product.description || "",
      pcb: product.pcb || "",
      weight: product.weight || 0,
      minimumQte: product.minimumQte || 0,
      maximumQte: product.maximumQte || 0,
      sealable: product.sealable || 0,
      alertQte: product.alertQte || 0,
      loyaltyPointsPerProduct: product.loyaltyPointsPerProduct || 0,
      loyaltyPointsPerUnit: product.loyaltyPointsPerUnit || 0,
      loyaltyPointsBonusQuantity: product.loyaltyPointsBonusQuantity || 0,
      loyaltyPointsThresholdQty: product.loyaltyPointsThresholdQty || 0,
      supplierId: product.supplierId || "",
      productTypeId: product.productTypeId || "",
      typePcbId: product.typePcbId || "",
      productStatusId: product.productStatusId || "",
      taxId: product.taxId || "",
      promotionId: product.promotionId || "",
      subCategories: subCategoryIds,
      relatedProducts: relatedProductIds,
      promo: !!product.promotionId,
      images: [],
      partnerSku: "",
      stocks: [],
      brandName: product.brand?.name || "",
      brandImage: null,
      activities: [],
      brandId: "",
    });

    // Clear search
    setSearchResults([]);
    setSearchTerm("");

    toast.success(`Product "${product.name}" data loaded into form`);
  };

  const handleBrandImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState((prev) => ({
        ...prev,
        brandImage: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required field validations
    if (!formState.sku || !formState.sku.trim()) {
      toast.error("SKU is required");
      return;
    }
    if (!formState.name || !formState.name.trim()) {
      toast.error("Product Name is required");
      return;
    }
    if (!formState.price || formState.price <= 0) {
      toast.error("Price is required and must be greater than zero");
      return;
    }
    if (!formState.supplierId || !formState.supplierId.trim()) {
      toast.error("Manufacturer is required");
      return;
    }
    if (!formState.brandId) {
      toast.error("Brand is required");
      return;
    }
    if (!formState.activities || formState.activities.length === 0) {
      toast.error("At least one Product Activity is required");
      return;
    }
    if (!formState.stocks || formState.stocks.length === 0) {
      toast.error("At least one stock entry is required");
      return;
    }

    // At least one stock entry must have all required fields filled
    const hasValidStock = (formState.stocks || []).some(
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
      return;
    }

    setIsSubmitting(true);

    try {
      let productId = selectedProductId;

      // If we don't have a selected product, check if one exists with this barcode
      if (!productId && formState.barcode) {
        try {
          // Search for product with this barcode
          const searchResponse = await axios.get(
            `/api/marketplace/products/search?query=${encodeURIComponent(
              formState.barcode,
            )}`,
          );

          if (
            searchResponse.data &&
            Array.isArray(searchResponse.data.products) &&
            searchResponse.data.products.length > 0
          ) {
            // Use the first product that matches the barcode
            const existingProduct = searchResponse.data.products.find(
              (p: any) => p.barcode === formState.barcode,
            );

            if (existingProduct) {
              toast.error(
                `Barcode already exists. Please use a different barcode.`,
              );
              setIsSubmitting(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error searching for existing product:", error);
          // Continue with product creation if search fails
        }
      }

      // If we don't have a selected product, check if one exists with this SKU
      if (!productId && formState.sku) {
        try {
          // Search for product with this SKU
          const searchResponse = await axios.get(
            `/api/marketplace/products/search?query=${encodeURIComponent(
              formState.sku,
            )}`,
          );

          if (
            searchResponse.data &&
            Array.isArray(searchResponse.data.products) &&
            searchResponse.data.products.length > 0
          ) {
            // Use the first product that matches the SKU
            const existingProduct = searchResponse.data.products.find(
              (p: any) => p.sku === formState.sku,
            );

            if (existingProduct) {
              toast.error(`SKU already exists. Please use a different SKU.`);
              setIsSubmitting(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error searching for existing product by SKU:", error);
          // Continue with product creation if search fails
        }
      }

      // Only create a new product if we don't have a product ID yet
      if (!productId) {
        // Convert empty strings to undefined for relational fields
        const payload = {
          ...formState,
          price: Number(formState.price),
          special_price: formState.special_price
            ? Number(formState.special_price)
            : undefined,
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
          // Include brand information
          brandName: formState.brandName || undefined,
          brandImage: formState.brandImage || undefined,
          brandId: formState.brandId,
          activities: formState.activities,
        };

        // Create skuPartners array from the partner SKU and stocks
        const skuPartners = [];
        skuPartners.push({
          partnerId: "", // Will be filled by the backend
          skuPartner: formState.partnerSku
            ? formState.partnerSku
            : formState.sku,
        });

        // Add the product payload
        const productPayload = {
          ...payload,
          skuPartners,
        };

        try {
          const productResponse = await createProduct(productPayload);
          if (productResponse && productResponse.id) {
            productId = productResponse.id;
          } else {
            throw new Error("Failed to create product");
          }
        } catch (error: any) {
          // If the error is due to barcode or SKU already existing, show toast and do not close modal
          const errorMessage = error?.message || "";
          if (errorMessage.includes("Barcode already exists")) {
            toast.error(
              "Barcode already exists. Please use a different barcode.",
            );
            setIsSubmitting(false);
            return;
          }
          if (errorMessage.includes("SKU already exists")) {
            toast.error("SKU already exists. Please use a different SKU.");
            setIsSubmitting(false);
            return;
          }
          // If the error is due to barcode already existing, try to find the product again
          if (
            error.message &&
            error.message.includes("Barcode already exists")
          ) {
            try {
              const retrySearch = await axios.get(
                `/api/marketplace/products/search?query=${encodeURIComponent(
                  formState.barcode,
                )}`,
              );

              if (
                retrySearch.data &&
                Array.isArray(retrySearch.data.products) &&
                retrySearch.data.products.length > 0
              ) {
                const existingProduct = retrySearch.data.products.find(
                  (p: any) => p.barcode === formState.barcode,
                );

                if (existingProduct) {
                  productId = existingProduct.id;
                  toast(
                    `Using existing product with barcode ${formState.barcode}. Creating SKU partner only.`,
                  );
                } else {
                  throw new Error(
                    "Product with this barcode exists but could not be found",
                  );
                }
              } else {
                throw new Error(
                  "Product with this barcode exists but could not be found",
                );
              }
            } catch (searchError) {
              console.error(
                "Error searching for existing product:",
                searchError,
              );
              throw error; // Re-throw the original error
            }
          } else {
            throw error;
          }
        }
      }

      // Create SKU partner and stocks
      if (productId) {
        try {
          // Create SKU partner - partnerId will be added in the route
          const skuPartnerResponse = await axios.post(
            "/api/marketplace/sku_partner/create",
            {
              productId,
              skuPartner: formState.partnerSku || formState.sku, // Use product SKU if empty
              skuProduct: formState.sku,
            },
          );

          if (skuPartnerResponse.data && skuPartnerResponse.data.skuPartner) {
            const skuPartnerId = skuPartnerResponse.data.skuPartner.id;

            // Create stocks for this SKU partner
            const stockPromises = formState.stocks.map((stock) => {
              if (!stock.sourceId) return Promise.resolve();

              return axios.post("/api/marketplace/stock/create", {
                skuPartnerId,
                sourceId: stock.sourceId,
                stockQuantity: stock.stockQuantity,
                special_price: stock.special_price,
                minQty: stock.minQty,
                maxQty: stock.maxQty,
                price: parseFloat(stock.price.toString()), // Convert to float
                loyaltyPointsPerProduct: stock.loyaltyPointsPerProduct,
                loyaltyPointsPerUnit: stock.loyaltyPointsPerUnit,
                loyaltyPointsBonusQuantity: stock.loyaltyPointsBonusQuantity,
                loyaltyPointsThresholdQty: stock.loyaltyPointsThresholdQty,
              });
            });

            await Promise.all(stockPromises.filter(Boolean));
          }
        } catch (error) {
          console.error("Error creating SKU partner or stocks:", error);
          toast.error("Failed to create SKU partner or stocks");
          // Continue with the rest of the process even if SKU partner creation fails
        }
      }

      toast.success(
        selectedProductId || productId !== null
          ? "SKU partner created successfully"
          : "Product created successfully",
      );

      // Call the refetch function to update the product list
      onClose();

      // Add a small delay before refetching to ensure the backend has processed everything
      setTimeout(() => {
        if (typeof onCreate === "function") {
          onCreate(formState);
        }
      }, 500);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Product
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
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

        {/* CSV Upload and Product Search */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Import from CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full rounded-lg border p-2 text-sm"
            />
          </div>

          {/* Simple Product Search */}
          <div className="mb-4 flex items-end space-x-2">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Search by Barcode or SKU
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter barcode or SKU"
                className="w-full rounded-lg border p-2"
                onKeyDown={(e) => e.key === "Enter" && searchProducts()}
              />
            </div>
            <button
              type="button"
              onClick={searchProducts}
              disabled={isSearching}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Search Results - Simple List */}
          {searchResults.length > 0 && (
            <div className="mb-4 rounded-lg border p-3">
              <h4 className="mb-2 font-medium">Found Products:</h4>
              <ul className="divide-y">
                {searchResults.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Barcode: {product.barcode} | SKU: {product.sku} | Price:{" "}
                        {product.price} Dt
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectProduct(product)}
                      className="rounded bg-green-100 px-3 py-1 text-sm text-green-700 hover:bg-green-200"
                    >
                      Use
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Show indicator when using existing product */}
        {selectedProductId && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 text-blue-700">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Using existing product - only SKU partner and stocks will be
                created
              </span>
            </div>
            <button
              type="button"
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setSelectedProductId(null)}
            >
              Clear selection and create new product instead
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex border-b">
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "basic"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </button>
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "relations"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("relations")}
          >
            Relationships
          </button>
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "partners"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("partners")}
          >
            Stock Management
          </button>
        </div>

        {/* Basic Information */}
        {activeTab === "basic" && (
          <div className="space-y-4 pb-6">
            <h3 className="text-xl font-semibold text-primary">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bar Code
                </label>
                <input
                  type="text"
                  placeholder="Bar Code"
                  value={formState.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="SKU"
                  value={formState.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formState.price || ""}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-32 rounded-lg border p-3"
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
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="w-32 rounded-lg border p-3"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Description"
                value={formState.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full rounded-lg border p-3"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Relationships */}
        {activeTab === "relations" && (
          <div className="pt-15 space-y-4">
            <h3 className="text-xl font-semibold text-primary">
              Relationships
            </h3>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_160px_128px] items-end gap-x-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <select
                  value={formState.supplierId}
                  onChange={(e) =>
                    handleInputChange("supplierId", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
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
                  value={formState.productTypeId}
                  onChange={(e) =>
                    handleInputChange("productTypeId", e.target.value)
                  }
                  className="w-60 rounded-lg border p-3"
                >
                  <option value="">Product Type</option>
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
                  value={formState.typePcbId}
                  onChange={(e) =>
                    handleInputChange("typePcbId", e.target.value)
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Status
                </label>
                <select
                  value={formState.productStatusId}
                  onChange={(e) =>
                    handleInputChange("productStatusId", e.target.value)
                  }
                  className="w-40 rounded-lg border p-3"
                >
                  <option value="">Product Status</option>
                  {productStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tax
                </label>
                <select
                  value={formState.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  className="w-32 rounded-lg border p-3"
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

            {/* Activities and Brand fields */}
            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Activities <span className="text-red-500">*</span>
                </label>
                <Select
                  isMulti
                  name="activities"
                  options={ACTIVITIES.map((activity) => ({
                    value: activity,
                    label: activity,
                  }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={
                    formState.activities?.map((activity) => ({
                      value: activity,
                      label: activity,
                    })) || []
                  }
                  onChange={(selected) => {
                    handleInputChange(
                      "activities",
                      selected ? selected.map((option) => option.value) : [],
                    );
                  }}
                  placeholder="Search and select activities..."
                  noOptionsMessage={() => "No activities found"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Brand <span className="text-red-500">*</span>
                </label>
                <Select
                  isClearable
                  isLoading={isLoadingBrands}
                  options={
                    brands?.map((brand) => ({
                      value: brand.id,
                      label: brand.name || "Unnamed Brand",
                      img: brand.img,
                    })) || []
                  }
                  value={
                    brands
                      ?.filter((brand) => brand.id === formState.brandId)
                      .map((brand) => ({
                        value: brand.id,
                        label: brand.name || "Unnamed Brand",
                        img: brand.img,
                      }))[0] || null
                  }
                  onChange={(selected) => {
                    handleInputChange("brandId", selected?.value || "");
                  }}
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-3">
                      <img
                        src={option.img}
                        alt={option.label}
                        className="h-8 w-8 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/32x32?text=No+Image";
                        }}
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                  placeholder="Select a brand..."
                  noOptionsMessage={() => "No brands found"}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
            </div>

            {/* Sub-Categories & Related Products */}
            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sub-Categories
                </label>
                <Select
                  isMulti
                  name="subCategories"
                  options={subCategories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={
                    formState.subCategories?.map((id) => {
                      const cat = subCategories.find((c) => c.id === id);
                      return { value: id, label: cat ? cat.name : id };
                    }) || []
                  }
                  onChange={(selected) => {
                    handleInputChange(
                      "subCategories",
                      selected ? selected.map((option) => option.value) : [],
                    );
                  }}
                  placeholder="Search and select subcategories..."
                  noOptionsMessage={() => "No subcategories found"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Related Products
                </label>
                <Select
                  isMulti
                  name="relatedProducts"
                  options={relatedProducts.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={
                    formState.relatedProducts?.map((id) => {
                      const product = relatedProducts.find((p) => p.id === id);
                      return { value: id, label: product ? product.name : id };
                    }) || []
                  }
                  onChange={(selected) => {
                    handleInputChange(
                      "relatedProducts",
                      selected ? selected.map((option) => option.value) : [],
                    );
                  }}
                  placeholder="Search and select related products..."
                  noOptionsMessage={() => "No related products found"}
                />
              </div>
            </div>

            {/* Promotion */}
            <div className="pt-4">
              <h4 className="mb-3 text-lg font-medium text-gray-800">
                Promotion
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formState.promo}
                  onChange={(e) => handleInputChange("promo", e.target.checked)}
                  className="h-5 w-5"
                  id="promo-checkbox"
                />
                <label
                  htmlFor="promo-checkbox"
                  className="text-sm font-medium text-gray-700"
                >
                  Promo Product
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="pt-4">
              <h4 className="mb-3 text-lg font-medium text-gray-800">Images</h4>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>
        )}

        {/* Partner SKUs */}
        {activeTab === "partners" && (
          <div className="pt-15 space-y-4 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">
              Stock Management
            </h3>
            {/* Partner SKU field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Your SKU
              </label>
              <input
                type="text"
                value={formState.partnerSku}
                onChange={handlePartnerSkuChange}
                className="w-full rounded-lg border p-3"
                placeholder="Enter your SKU (optional)"
              />
            </div>
            <div className="space-y-4">
              {formState.stocks.map((stock, index) => (
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
                        {getAvailableSources(index).map((source) => (
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
