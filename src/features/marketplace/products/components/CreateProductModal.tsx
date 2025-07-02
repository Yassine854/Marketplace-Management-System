import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Select from "react-select";

interface Brand {
  id: string;
  img: string;
  name: string | null;
}

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
  }) => Promise<any>;
  suppliers: Array<{ id: string; companyName: string }>;
  productTypes: Array<{ id: string; type: string }>;
  typePcbs: Array<{ id: string; name: string }>;
  productStatuses: Array<{ id: string; name: string }>;
  subCategories: Array<{ id: string; name: string }>;
  relatedProducts: Array<{ id: string; name: string }>;
  taxes: Array<{ id: string; value: string }>;
  promotions: Array<{ id: string; promoPrice: string }>;
  partners: Array<{ id: string; username: string }>;
  activities: string[];
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
  partners,
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
    skuPartners: [] as Array<{
      partnerId: string;
      skuPartner: string;
    }>,
    activities: [] as string[],
    brandId: "" as string,
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

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
        skuPartners: [],
        activities: [],
        brandId: "",
      });
      setActiveTab("basic");
    }
  }, [isOpen]);

  // Fetch brands when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    setIsLoadingBrands(true);
    try {
      const response = await fetch("/api/marketplace/brand/getAll");
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || []);
      } else {
        console.error("Failed to fetch brands");
        toast.error("Failed to load brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to load brands");
    } finally {
      setIsLoadingBrands(false);
    }
  };

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
        }));

        toast.success("CSV data imported successfully");
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
      }
    };
    reader.readAsText(file);
  };

  const handleSkuPartnerChange = (index: number, field: string, value: any) => {
    const updatedPartners = [...formState.skuPartners];
    updatedPartners[index] = {
      ...updatedPartners[index],
      [field]: value,
    };
    setFormState((prev) => ({ ...prev, skuPartners: updatedPartners }));
  };

  const addSkuPartner = () => {
    setFormState((prev) => ({
      ...prev,
      skuPartners: [
        ...prev.skuPartners,
        {
          partnerId: "",
          skuPartner: "",
        },
      ],
    }));
  };

  const removeSkuPartner = (index: number) => {
    const updatedPartners = [...formState.skuPartners];
    updatedPartners.splice(index, 1);
    setFormState((prev) => ({ ...prev, skuPartners: updatedPartners }));
  };

  const getAvailablePartners = (currentIndex: number) => {
    const selectedPartnerIds = formState.skuPartners
      .filter((_, i) => i !== currentIndex)
      .map((p) => p.partnerId);

    return partners.filter((p) => !selectedPartnerIds.includes(p.id));
  };

  const handleSubmit = async () => {
    if (!formState.name || !formState.sku || !formState.price) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
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
        supplierId: formState.supplierId || undefined,
        productTypeId: formState.productTypeId || undefined,
        typePcbId: formState.typePcbId || undefined,
        productStatusId: formState.productStatusId || undefined,
        taxId: formState.taxId || undefined,
        promotionId: formState.promotionId || undefined,
        skuPartners:
          formState.skuPartners.length > 0 ? formState.skuPartners : undefined,
      };

      const missingFields = [];
      if (!formState.barcode) missingFields.push("Barcode");
      if (!formState.sku) missingFields.push("SKU");
      if (!formState.name) missingFields.push("Product Name");
      if (!formState.price) missingFields.push("Price");
      if (!formState.supplierId) missingFields.push("Manufacturer");
      if (!formState.brandId) missingFields.push("Brand");
      if (!formState.activities || formState.activities.length === 0)
        missingFields.push("Product Activity");
      if (missingFields.length > 0) {
        missingFields.forEach((field) =>
          toast.error(`Please fill in required field: ${field}`),
        );
        return;
      }

      const result = await onCreate(payload);
      if (result) {
        onClose();
      }
    } catch (error) {
      // Handle errors without closing the modal
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";

      if (errorMessage.includes("Barcode already exists")) {
        toast.error(
          "This barcode already exists. Please use a different barcode.",
        );
      } else if (errorMessage.includes("SKU already exists")) {
        toast.error("This SKU already exists. Please use a different SKU.");
      } else if (errorMessage.toLowerCase().includes("unique constraint")) {
        if (errorMessage.toLowerCase().includes("barcode")) {
          toast.error(
            "This barcode already exists. Please use a different barcode.",
          );
        } else if (errorMessage.toLowerCase().includes("sku")) {
          toast.error("This SKU already exists. Please use a different SKU.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }

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

        {/* CSV Upload and SKU Search */}
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
        </div>

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
            Partner SKUs
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tax
                </label>
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
                  value={formState.activities.map((activity) => ({
                    value: activity,
                    label: activity,
                  }))}
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
                  options={brands.map((brand) => ({
                    value: brand.id,
                    label: brand.name || "Unnamed Brand",
                    img: brand.img,
                  }))}
                  value={
                    brands
                      .filter((brand) => brand.id === formState.brandId)
                      .map((brand) => ({
                        value: brand.id,
                        label: brand.name || "Unnamed Brand",
                        img: brand.img,
                      }))[0] || null
                  }
                  onChange={(selected) => {
                    handleInputChange("brandId", selected?.value || "");
                  }}
                  formatOptionLabel={(option: any) => (
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
                  value={formState.subCategories.map((id) => {
                    const cat = subCategories.find((c) => c.id === id);
                    return { value: id, label: cat ? cat.name : id };
                  })}
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
                  value={formState.relatedProducts.map((id) => {
                    const product = relatedProducts.find((p) => p.id === id);
                    return { value: id, label: product ? product.name : id };
                  })}
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
            <h3 className="text-xl font-semibold text-primary">Partner SKUs</h3>
            <div className="space-y-4">
              {formState.skuPartners.map((partner, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">Partner SKU #{index + 1}</h4>
                    <button
                      onClick={() => removeSkuPartner(index)}
                      className="rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none"
                      aria-label="Remove Partner SKU"
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
                        Partner
                      </label>
                      <select
                        value={partner.partnerId}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "partnerId",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      >
                        <option value="">Select Partner</option>
                        {getAvailablePartners(index).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.username}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Partner SKU
                      </label>
                      <input
                        type="text"
                        value={partner.skuPartner}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "skuPartner",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Partner's SKU code"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSkuPartner}
                className="w-full rounded-lg bg-gray-100 p-3 text-gray-700 hover:bg-gray-200"
              >
                + Add Partner SKU
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
