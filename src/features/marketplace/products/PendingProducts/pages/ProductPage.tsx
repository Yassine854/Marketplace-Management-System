import ProductTable from "../table/ProductTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState, useEffect } from "react";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
import { Product } from "@/types/product";
import { useProductActions } from "../hooks/useProductActions";
import ShowProductModal from "../components/ShowProductModal";

// Add interface at the top
interface ProductImage {
  id: string;
  url: string;
}

const ProductPage = () => {
  const { products, isLoading, error, refetch } = useGetAllProducts();
  const {
    editProduct,
    deleteProduct,
    acceptProduct,
    isLoading: isActionLoading,
    error: actionError,
  } = useProductActions();

  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [skuPartners, setSkuPartners] = useState([]);

  // Change your state initializations to:
  const [typePcbs, setTypePcbOptions] = useState<any[]>([]);
  const [productTypes, setProductTypeOptions] = useState<any[]>([]);
  const [productStatuses, setProductStatusOptions] = useState<any[]>([]);
  const [suppliers, setSupplierOptions] = useState<any[]>([]);
  const [taxes, setTaxOptions] = useState<any[]>([]);
  const [promotions, setPromotionOptions] = useState<any[]>([]);
  const [subCategories, setSubCategoryOptions] = useState<any[]>([]);
  const [partners, setPartners] = useState<
    Array<{ id: string; username: string }>
  >([]);

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

  const handleAccept = async (id: string) => {
    const result = await acceptProduct(id);
    if (result) {
      refetch();
    }
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

  // Open the show modal with the selected product
  const openShowModal = (product: Product) => {
    setSelectedProduct(product);
    setIsShowModalOpen(true);
  };

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
            <p className="text-sm text-gray-600">Manage your products</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Loading/Error Status */}
            {isActionLoading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            )}

            {actionError && (
              <div className="rounded bg-red-50 px-3 py-1 text-sm text-red-700">
                {actionError}
              </div>
            )}
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <ProductTable
            products={products}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openShowModal}
            onDelete={handleDelete}
            onAccept={handleAccept}
          />
        </div>
      </div>

      <ShowProductModal
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        product={
          selectedProduct && {
            ...selectedProduct,
            images: (selectedProduct.images as ProductImage[]) || [],
            productSubCategories: selectedProduct.productSubCategories || [],
            relatedProducts: selectedProduct.relatedProducts || [],
          }
        }
        suppliers={suppliers}
        productTypes={productTypes}
        typePcbs={typePcbs}
        productStatuses={productStatuses}
        subCategories={subCategories}
        relatedProducts={products}
        taxes={taxes}
        promotions={promotions}
        partners={partners}
        skuPartners={skuPartners.filter(
          (sp: { productId: string }) => sp.productId === selectedProduct?.id,
        )}
      />
    </div>
  );
};

export default ProductPage;
