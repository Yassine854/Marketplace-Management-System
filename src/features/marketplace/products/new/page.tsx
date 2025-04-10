import { useState, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

const ProductForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const [typePcbOptions, setTypePcbOptions] = useState<any[]>([]);
  const [productTypeOptions, setProductTypeOptions] = useState<any[]>([]);
  const [productStatusOptions, setProductStatusOptions] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [taxOptions, setTaxOptions] = useState<any[]>([]);
  const [promotionOptions, setPromotionOptions] = useState<any[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<any[]>([]);
  const [relatedProductOptions, setRelatedProductOptions] = useState<any[]>([]);

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    [],
  );
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    string[]
  >([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  // Subcategories handler
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    setSelectedSubcategories(options);
  };

  // Related products handler
  const handleRelatedProductsChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const options = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    setSelectedRelatedProducts(options);
  };

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
          products.products.map((p: any) => ({ value: p.id, label: p.name })),
        );
      } catch (error) {
        toast.error("Failed to load form options");
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("skuPartner", skuPartner);
    formData.append("price", price);
    formData.append("cost", cost);
    formData.append("stock", stock);
    formData.append("promo", promo.toString());
    formData.append("minimumQte", minimumQte);
    formData.append("maximumQte", maximumQte);
    formData.append("sealableAlertQte", sealableAlertQte);
    formData.append("pcb", pcb);
    formData.append("weight", weight);
    formData.append("description", description);
    formData.append("typePcbId", typePcbId);
    formData.append("productTypeId", productTypeId);
    formData.append("productStatusId", productStatusId);
    formData.append("supplierId", supplierId);
    formData.append("taxId", taxId);
    formData.append("promotionId", promotionId);

    try {
      const productResponse = await fetch("/api/marketplace/products/create", {
        method: "POST",
        body: formData,
      });

      if (!productResponse.ok) {
        throw new Error("Failed to create product");
      }

      const productData = await productResponse.json();
      const productId = productData.product.id;

      // Change these lines in handleSubmit:
      const subCategoryPromises = selectedSubcategories.map((subcategoryId) =>
        fetch("/api/marketplace/product_subcategories/create", {
          method: "POST",
          body: JSON.stringify({
            productId: productId,
            subcategoryId: subcategoryId,
          }),
          headers: { "Content-Type": "application/json" },
        }),
      );

      const relatedProductPromises = selectedRelatedProducts.map(
        (relatedProductId) =>
          fetch("/api/marketplace/related_products/create", {
            method: "POST",
            body: JSON.stringify({ productId, relatedProductId }),
            headers: { "Content-Type": "application/json" },
          }),
      );
      await Promise.all([...subCategoryPromises, ...relatedProductPromises]);

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        formData.append("productId", productId);

        const imageResponse = await fetch("/api/marketplace/image/create", {
          method: "POST",
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to upload images");
        }
      }

      toast.success("Product created successfully!");
      router.push("/marketplace/products/all");

      // Reset form
      setName("");
      setSku("");
      setPrice("");
      setStock("");
      setDescription("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 w-full px-3 py-6 sm:px-4 lg:py-8">
      <div className="box w-full xl:p-8">
        <h2 className="h2 mb-6">Create New Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Product Name */}
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

          {/* SKU */}
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

          {/* Price */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-2 block font-medium">Price *</label>
            <input
              type="number"
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
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              className="w-full rounded-lg border p-2"
            />
          </div>

          {/* Stock */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-2 block font-medium">Stock *</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
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
            <label className="mb-2 block font-medium">Minimum Qte *</label>
            <input
              type="number"
              value={minimumQte}
              onChange={(e) => setMinimumQte(e.target.value)}
              required
              className="w-full rounded-lg border p-2"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="mb-2 block font-medium">Maximum Qte *</label>
            <input
              type="number"
              value={maximumQte}
              onChange={(e) => setMaximumQte(e.target.value)}
              required
              className="w-full rounded-lg border p-2"
            />
          </div>

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

          <div className="col-span-2 md:col-span-1">
            <label className="mb-2 block font-medium">Description </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-lg border p-2"
            />
          </div>

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
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategories Multi-Select */}
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

          {/* Related Products Multi-Select */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-2 block font-medium">Related Products *</label>
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

          {promo && (
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 block font-medium">Promotion</label>
              <select
                value={promotionId}
                onChange={(e) => setPromotionId(e.target.value)}
                required
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

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="mb-2 block font-medium">Images *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2"
            />
          </div>

          {/* Promo Checkbox */}
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={promo}
                onChange={() => setPromo(!promo)}
                className="h-4 w-4"
              />
              Promo Product
            </label>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn hover:shadow-none disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
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
      </div>
    </div>
  );
};

export default ProductForm;
