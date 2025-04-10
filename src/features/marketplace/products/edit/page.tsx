import { useState, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the category ID from URL
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [skuPartner, setSkuPartner] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [promo, setPromo] = useState(false);
  const [minimumQte, setMinimumQte] = useState("");
  const [maximumQte, setMaximumQte] = useState("");
  const [sealableAlertQte, setSealableAlertQte] = useState("");
  const [pcb, setPcb] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [typePcbId, setTypePcbId] = useState("");
  const [productTypeId, setProductTypeId] = useState("");
  const [productStatusId, setProductStatusId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [taxId, setTaxId] = useState("");
  const [promotionId, setPromotionId] = useState("");

  // Options State
  const [typePcbOptions, setTypePcbOptions] = useState<any[]>([]);
  const [productTypeOptions, setProductTypeOptions] = useState<any[]>([]);
  const [productStatusOptions, setProductStatusOptions] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [taxOptions, setTaxOptions] = useState<any[]>([]);
  const [promotionOptions, setPromotionOptions] = useState<any[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<any[]>([]);
  const [relatedProductOptions, setRelatedProductOptions] = useState<any[]>([]);

  // Relationships
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    [],
  );
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    string[]
  >([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    const fetchProductAndOptions = async () => {
      try {
        setLoading(true);

        // Fetch product data
        const productResponse = await fetch(`/api/marketplace/products/${id}`);
        if (!productResponse.ok) throw new Error("Failed to fetch product");
        const productData = await productResponse.json();
        setProduct(productData.product);

        // Set form values
        const p = productData.product;
        setName(p.name);
        setSku(p.sku);
        setSkuPartner(p.skuPartner);
        setPrice(p.price.toString());
        setCost(p.cost.toString());
        setStock(p.stock?.toString() || "");
        setPromo(p.promo);
        setMinimumQte(p.minimumQte.toString());
        setMaximumQte(p.maximumQte.toString());
        setSealableAlertQte(p.sealableAlertQte.toString());
        setPcb(p.pcb);
        setWeight(p.weight?.toString() || "");
        setDescription(p.description);
        setTypePcbId(p.typePcbId);
        setProductTypeId(p.productTypeId);
        setProductStatusId(p.productStatusId);
        setSupplierId(p.supplierId);
        setTaxId(p.taxId);
        setPromotionId(p.promotionId || "");
        setExistingImages(p.images || []);

        // Set relationships
        setSelectedSubcategories(
          p.productSubCategories.map((sc: any) => sc.subcategoryId),
        );
        setSelectedRelatedProducts(
          p.relatedProducts.map((rp: any) => rp.relatedProductId),
        );

        // Fetch options
        const responses = await Promise.all([
          fetch("/api/marketplace/type_pcb/getAll"),
          fetch("/api/marketplace/product_type/getAll"),
          fetch("/api/marketplace/product_status/getAll"),
          fetch("/api/marketplace/supplier/getAll"),
          fetch("/api/marketplace/tax/getAll"),
          fetch("/api/marketplace/promotion/getAll"),
          fetch("/api/marketplace/sub_category/getAll"),
          fetch("/api/marketplace/products/getAll"),
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
        ] = await Promise.all(responses.map((res) => res.json()));

        // Set options
        setTypePcbOptions(
          typePcbs.typePcbs.map((tp: any) => ({
            value: tp.id,
            label: tp.name,
          })),
        );
        setProductTypeOptions(
          productTypes.productTypes.map((pt: any) => ({
            value: pt.id,
            label: pt.type,
          })),
        );
        setProductStatusOptions(
          productStatuses.productStatuses.map((ps: any) => ({
            value: ps.id,
            label: ps.name,
          })),
        );
        setSupplierOptions(
          suppliers.manufacturers.map((s: any) => ({
            value: s.id,
            label: s.companyName,
          })),
        );
        setTaxOptions(
          taxes.taxes.map((t: any) => ({
            value: t.id,
            label: t.value.toString(),
          })),
        );
        setPromotionOptions(
          promotions.promotions.map((pr: any) => ({
            value: pr.id,
            label: pr.promoPrice.toString(),
          })),
        );
        setSubCategoryOptions(
          subCategories.subCategories.map((sc: any) => ({
            value: sc.id,
            label: sc.name,
          })),
        );
        setRelatedProductOptions(
          products.products
            .filter((p: any) => p.id !== id)
            .map((p: any) => ({ value: p.id, label: p.name })),
        );
      } catch (error) {
        toast.error("Failed to load product data");
        router.push("/marketplace/products/all");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndOptions();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    setSelectedSubcategories(options);
  };

  const handleRelatedProductsChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const options = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    setSelectedRelatedProducts(options);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map(async (imageId) => {
            const response = await fetch(`/api/marketplace/image/${imageId}`, {
              method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete image");
          }),
        );
        // Update existing images state
        setExistingImages((prev) =>
          prev.filter((img) => !imagesToDelete.includes(img.id)),
        );
        setImagesToDelete([]);
      }

      // Update product
      const updateResponse = await fetch(`/api/marketplace/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sku,
          skuPartner,
          price: parseFloat(price),
          cost: parseFloat(cost),
          stock: stock ? parseInt(stock) : null,
          promo,
          minimumQte: parseInt(minimumQte),
          maximumQte: parseInt(maximumQte),
          sealableAlertQte: parseInt(sealableAlertQte),
          pcb,
          weight: weight ? parseFloat(weight) : null,
          description,
          typePcbId,
          productTypeId,
          productStatusId,
          supplierId,
          taxId,
          promotionId: promotionId || null,
        }),
      });

      if (!updateResponse.ok) throw new Error("Failed to update product");

      // Update relationships
      await updateRelationships();

      // Upload new images
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        formData.append("productId", id as string);

        const imageResponse = await fetch("/api/marketplace/image/create", {
          method: "POST",
          body: formData,
        });
        if (!imageResponse.ok) throw new Error("Failed to upload images");
      }

      toast.success("Product updated successfully!");
      router.push("/marketplace/products/all");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const updateRelationships = async () => {
    try {
      // Remove existing relationships
      await Promise.all([
        fetch(`/api/marketplace/product_subcategories/deleteByProduct/${id}`, {
          method: "DELETE",
        }),
        fetch(`/api/marketplace/related_products/deleteByProduct/${id}`, {
          method: "DELETE",
        }),
      ]);

      // Create new relationships
      const subCategoryPromises = selectedSubcategories.map((subcategoryId) =>
        fetch("/api/marketplace/product_subcategories/create", {
          method: "POST",
          body: JSON.stringify({ productId: id, subcategoryId }),
          headers: { "Content-Type": "application/json" },
        }),
      );

      const relatedProductPromises = selectedRelatedProducts.map(
        (relatedProductId) =>
          fetch("/api/marketplace/related_products/create", {
            method: "POST",
            body: JSON.stringify({ productId: id, relatedProductId }),
            headers: { "Content-Type": "application/json" },
          }),
      );

      await Promise.all([...subCategoryPromises, ...relatedProductPromises]);
    } catch (error) {
      throw new Error("Failed to update relationships");
    }
  };

  return (
    <div className="mt-12 w-full px-3 py-6 sm:px-4 lg:py-8">
      <div className="box w-full xl:p-8">
        <h2 className="h2 mb-6">Edit Product</h2>
        {loading ? (
          <div className="text-center">Loading product data...</div>
        ) : product ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Product Information */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">SKU *</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              />
            </div>

            {/* <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Partner SKU</label>
              <input
                type="text"
                value={skuPartner}
                onChange={(e) => setSkuPartner(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div> */}

            {/* Pricing */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Price *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Cost *</label>
              <input
                type="number"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              />
            </div>

            {/* Stock Management */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">
                Sealable Alert Qte *
              </label>
              <input
                type="number"
                value={sealableAlertQte}
                onChange={(e) => setSealableAlertQte(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">
                Minimum Quantity *
              </label>
              <input
                type="number"
                value={minimumQte}
                onChange={(e) => setMinimumQte(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">
                Maximum Quantity *
              </label>
              <input
                type="number"
                value={maximumQte}
                onChange={(e) => setMaximumQte(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              />
            </div>

            {/* Product Details */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">PCB</label>
              <input
                type="text"
                value={pcb}
                onChange={(e) => setPcb(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Weight </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-2 block font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border p-2"
                rows={4}
              />
            </div>

            {/* Dropdown Selects */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Type PCB *</label>
              <select
                value={typePcbId}
                onChange={(e) => setTypePcbId(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              >
                <option value="">Select Type PCB</option>
                {typePcbOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Product Type *</label>
              <select
                value={productTypeId}
                onChange={(e) => setProductTypeId(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              >
                <option value="">Select Product Type</option>
                {productTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Status */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Product Status *</label>
              <select
                value={productStatusId}
                onChange={(e) => setProductStatusId(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              >
                <option value="">Select Product Status</option>
                {productStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Supplier *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              >
                <option value="">Select Supplier</option>
                {supplierOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tax */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Tax *</label>
              <select
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                required
                className="w-full rounded-lg border p-2"
              >
                <option value="">Select Tax</option>
                {taxOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}%
                  </option>
                ))}
              </select>
            </div>

            {promo && (
              <div className="col-span-2 md:col-span-1">
                <label className="mb-2 block font-medium">Promotion</label>
                <select
                  value={promotionId}
                  onChange={(e) => setPromotionId(e.target.value)}
                  className="w-full rounded-lg border p-2"
                >
                  <option value="">Select Promotion</option>
                  {promotionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Relationships */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Subcategories *</label>
              <select
                multiple
                value={selectedSubcategories}
                onChange={handleSubcategoryChange}
                className="w-full rounded-lg border p-2"
              >
                {subCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Related Products</label>
              <select
                multiple
                value={selectedRelatedProducts}
                onChange={handleRelatedProductsChange}
                className="w-full rounded-lg border p-2"
              >
                {relatedProductOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Images */}
            <div className="col-span-2">
              <label className="mb-2 block font-medium">Existing Images</label>
              <div className="mb-4 flex flex-wrap gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <img
                      src={image.url}
                      alt={name}
                      className={`h-24 w-24 rounded object-cover ${
                        imagesToDelete.includes(image.id) ? "opacity-50" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!imagesToDelete.includes(image.id)) {
                          setImagesToDelete((prev) => [...prev, image.id]);
                        } else {
                          setImagesToDelete((prev) =>
                            prev.filter((id) => id !== image.id),
                          );
                        }
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      {imagesToDelete.includes(image.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M5 11h14v2H5z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <label className="mb-2 block font-medium">Add New Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={promo}
                  onChange={(e) => {
                    setPromo(e.target.checked);
                    if (!e.target.checked) {
                      setPromotionId(""); // Clear promotion when unchecking
                    }
                  }}
                  className="h-4 w-4"
                />
                Promo Product
              </label>
            </div>

            {/* Submit Section */}
            <div className="col-span-2 flex justify-end gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn hover:shadow-none disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/marketplace/products/all")}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">Product not found</div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
