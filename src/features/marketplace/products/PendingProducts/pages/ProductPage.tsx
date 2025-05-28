import ProductTable from "../table/ProductTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "@/features/shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchContent =
        `${product.id} ${product.name} ${product.barcode} ${product.sku}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [products, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (id: string, updatedProduct: Partial<Product>) => {
    const result = await editProduct(id, updatedProduct);
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
      const fetchSkuPartners = async () => {
        if (selectedProduct) {
          const response = await fetch(`/api/marketplace/sku_partner/getAll`);
          const data = await response.json();
          const productSkuPartners = data.skuPartners.filter(
            (sp: any) => sp.productId === selectedProduct.id,
          );
          setSkuPartners(productSkuPartners);
        }
      };
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
      } catch (error) {}
    };

    fetchOptions();
  }, []);

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Open the show modal with the selected product
  const openShowModal = (product: Product) => {
    setSelectedProduct(product);
    setIsShowModalOpen(true);
  };

  return (
    <div className="box-border flex h-screen w-full flex-col p-4 pt-24">
      <div className="flex-shrink-0 bg-white p-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold capitalize">Products</h1>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 left-2 flex items-center">
                🔍
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="whitespace-nowrap font-bold">
                Sort by:
              </label>
              <select
                id="sort"
                className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortState}
                onChange={(e) =>
                  setSortState(e.target.value as "newest" | "oldest")
                }
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="relative flex w-full flex-grow flex-col overflow-y-auto bg-n10 px-3">
        <ProductTable
          products={paginatedProducts}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          onEdit={openShowModal}
          onDelete={handleDelete}
          onAccept={handleAccept}
        />
      </div>

      <Divider />

      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />

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
    </div>
  );
};

export default ProductPage;
