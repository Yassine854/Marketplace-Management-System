import { useState, useEffect, useMemo } from "react";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
import { useProductActions } from "../hooks/useProductActions";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { Product } from "@/types/product";
import ProductTable from "../table/ProductTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import CreateProductModal from "../components/CreateProductModal";
import EditProductModal from "../components/EditProductModal";

interface ProductImage {
  id: string;
  url: string;
}

const ProductPage = () => {
  const { products, isLoading, error, refetch } = useGetAllProducts();
  const {
    editProduct,
    deleteProduct,
    isLoading: isActionLoading,
    error: actionError,
  } = useProductActions();
  const {
    createProduct,
    isLoading: isCreating,
    error: createError,
  } = useCreateProduct();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [skuPartners, setSkuPartners] = useState([]);
  const [sources, setSources] = useState([]);
  const [partners, setPartners] = useState<Array<{ id: string; name: string }>>(
    [],
  );

  const [typePcbs, setTypePcbOptions] = useState<any[]>([]);
  const [productTypes, setProductTypeOptions] = useState<any[]>([]);
  const [productStatuses, setProductStatusOptions] = useState<any[]>([]);
  const [suppliers, setSupplierOptions] = useState<any[]>([]);
  const [taxes, setTaxOptions] = useState<any[]>([]);
  const [promotions, setPromotionOptions] = useState<any[]>([]);
  const [subCategories, setSubCategoryOptions] = useState<any[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchContent =
        `${product.id} ${product.name} ${product.barcode} ${product.sku}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [products, searchTerm]);

  const handleEdit = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const result = await editProduct(id, updatedProduct);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const fetchProductSkuPartners = async () => {
      if (selectedProduct) {
        try {
          const response = await fetch(`/api/marketplace/sku_partner/getAll`);
          const data = await response.json();
          const productSkuPartners = data.skuPartners.filter(
            (sp: any) => sp.productId === selectedProduct.id,
          );
          setSkuPartners(productSkuPartners);
        } catch (error) {
          console.error("Error fetching SKU partners:", error);
        }
      }
    };

    fetchProductSkuPartners();
  }, [selectedProduct]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const responses = await Promise.all([
          fetch("/api/marketplace/type_pcb/getAll"),
          fetch("/api/marketplace/product_type/getAll"),
          fetch("/api/marketplace/product_status/getAll"),
          fetch("/api/marketplace/supplier/getAll"),
          fetch("/api/marketplace/tax/getAll"),
          fetch("/api/marketplace/promotion/getAll"),
          fetch("/api/marketplace/sub_category/getAll"),
          fetch("/api/marketplace/products/getAll"),
          fetch("/api/marketplace/partners/getAll"),
        ]);

        const [
          typePcbs,
          productTypes,
          productStatuses,
          suppliers,
          taxes,
          promotions,
          subCategories,
          products,
          partners,
        ] = await Promise.all(responses.map((res) => res.json()));

        setTypePcbOptions(typePcbs.typePcbs);
        setProductTypeOptions(productTypes.productTypes);
        setProductStatusOptions(productStatuses.productStatuses);
        setSupplierOptions(suppliers.manufacturers);
        setTaxOptions(taxes.taxes);
        setPromotionOptions(promotions.promotions);
        setSubCategoryOptions(subCategories.subCategories);
        setPartners(partners.partners);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch("/api/marketplace/source/getAll");
        if (response.ok) {
          const data = await response.json();
          setSources(data.sources || []);
        } else {
          console.error("Failed to fetch sources");
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    fetchSources();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        paddingTop: "100px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold capitalize text-gray-900">
              Products
            </h1>
            <p className="text-sm text-gray-600">Manage your product catalog</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Loading/Error Status */}
            {(isActionLoading || isCreating) && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            )}

            {(actionError || createError) && (
              <div className="rounded bg-red-50 px-3 py-1 text-sm text-red-700">
                {actionError || createError}
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn flex items-center gap-2"
              title="Add new product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <ProductTable
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async (productData) => {
          await createProduct(productData);
          refetch();
          setIsModalOpen(false);
        }}
        suppliers={suppliers}
        productTypes={productTypes}
        typePcbs={typePcbs}
        productStatuses={productStatuses}
        subCategories={subCategories}
        relatedProducts={products}
        taxes={taxes}
        promotions={promotions}
        partners={partners}
      />

      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={async (updatedProduct) => {
            await handleEdit(updatedProduct.id, updatedProduct);
            setIsEditModalOpen(false);
          }}
          product={{
            ...selectedProduct,
            images: (selectedProduct?.images || []) as ProductImage[],
            productSubCategories: selectedProduct?.productSubCategories || [],
            relatedProducts: selectedProduct?.relatedProducts || [],
            brand: selectedProduct?.brand
              ? { ...selectedProduct.brand, productId: selectedProduct.id }
              : undefined,
          }}
          suppliers={suppliers}
          productTypes={productTypes}
          typePcbs={typePcbs}
          productStatuses={productStatuses}
          subCategories={subCategories}
          relatedProducts={products}
          taxes={taxes}
          promotions={promotions}
          skuPartners={skuPartners}
          sources={sources}
        />
      )}
    </div>
  );
};

export default ProductPage;
