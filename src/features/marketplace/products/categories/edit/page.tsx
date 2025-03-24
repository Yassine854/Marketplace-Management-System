import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import { useParams } from "next/navigation"; // Assuming you are using next navigation

const EditCategoryPage = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the category ID from URL
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [nameCategory, setNameCategory] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch category data when the component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/marketplace/category/${id}`);
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        setCategory(data.category);
        setNameCategory(data.category.nameCategory); // Set initial value for the input
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load category",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nameCategory", nameCategory);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch(`/api/marketplace/category/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating category");
      }

      toast.success("Category updated successfully!");
      router.push(`/marketplace/products/categories/all`);

      await fetch(`/api/marketplace/products/categories/all`);
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
        <h2 className="h2">Edit Category</h2>
        <a className="btn" href="#">
          Manage Categories
        </a>
      </div>
      <div className="grid grid-cols-12 gap-4 xxxl:gap-6">
        <form className="col-span-12" onSubmit={handleSubmit}>
          <div className="box w-full xl:p-8">
            <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
              <p className="font-medium">Category Details</p>
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
                <p className="mb-1 font-medium">Edit Category Details</p>
                <span className="text-xs">Modify the category information</span>
              </div>

              {/* Category Name */}
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="nameCategory"
                  className="mb-4 block font-medium md:text-lg"
                >
                  Category Name *
                </label>
                <input
                  className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                  placeholder="Enter Category Name"
                  id="nameCategory"
                  required
                  type="text"
                  value={nameCategory}
                  onChange={(e) => setNameCategory(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label
                  htmlFor="image"
                  className="mb-4 block font-medium md:text-lg"
                >
                  Category Image (Optional)
                </label>
                {category?.image && (
                  <div className="mb-4">
                    <img
                      src={category.image}
                      alt="Current Category"
                      className="h-20 w-20 object-cover"
                    />
                  </div>
                )}
                <input
                  className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Form Actions */}
              <div className="col-span-2 flex justify-end gap-4">
                <button
                  type="submit"
                  className="btn hover:shadow-none"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Category"}
                </button>
                <button
                  type="reset"
                  className="btn-outline shadow-none"
                  onClick={() => {
                    setNameCategory("");
                    setImageFile(null);
                    router.push(`/marketplace/products/categories/all`);
                  }}
                >
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

export default EditCategoryPage;
