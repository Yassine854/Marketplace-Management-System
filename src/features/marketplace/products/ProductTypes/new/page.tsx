import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

const ProductTypeForm = () => {
  const [productType, setProductType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/marketplace/product_type/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: productType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating product type");
      }

      const result = await response.json();
      toast.success("Product type created successfully!");
      setProductType(""); // Reset the input field
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <h2 className="h2">Create New Product Type</h2>
        <a className="btn" href="#">
          Manage Product Types
        </a>
      </div>
      <div className="grid grid-cols-12 gap-4 xxxl:gap-6">
        <form className="col-span-12" onSubmit={handleSubmit}>
          <div className="box w-full xl:p-8">
            <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
              <p className="font-medium">New Product Type</p>
              <div className="relative top-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cursor-pointer"
                >
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                </svg>
              </div>
            </div>
            <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
              <div className="bb-dashed col-span-2 pb-6">
                <p className="mb-1 font-medium">Create a Product Type</p>
                <span className="text-xs">Define a new product type</span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="productType"
                  className="mb-4 block font-medium md:text-lg"
                >
                  Product Type
                </label>
                <input
                  className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                  placeholder="Enter Product Type"
                  id="productType"
                  required
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button type="submit" className="btn hover:shadow-none">
                  Create
                </button>
                <button type="reset" className="btn-outline shadow-none">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductTypeForm;
