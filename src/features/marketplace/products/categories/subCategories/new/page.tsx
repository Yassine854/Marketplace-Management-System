import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

const SubcategoryForm = () => {
  const [name, setName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { categoryId } = useParams<{ categoryId: string }>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryId", categoryId as string);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch("/api/marketplace/sub_category/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating subcategory");
      }

      const result = await response.json();
      toast.success("Subcategory created successfully!");
      // Redirect to subcategories list
      router.push(
        `/marketplace/products/categories/${categoryId}/subCategories/all`,
      );
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
        <h2 className="h2">Create New Subcategory</h2>
        <a
          className="btn"
          href={`/marketplace/products/categories/${categoryId}/subCategories/all`}
        >
          Manage Subcategories
        </a>
      </div>
      <div className="grid grid-cols-12 gap-4 xxxl:gap-6">
        <form className="col-span-12" onSubmit={handleSubmit}>
          <div className="box w-full xl:p-8">
            <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
              <p className="font-medium">New Subcategory Details</p>
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
                <p className="mb-1 font-medium">Create a New Subcategory</p>
                <span className="text-xs">
                  Define a new product subcategory under this category
                </span>
              </div>

              {/* Subcategory Name */}
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="name"
                  className="mb-4 block font-medium md:text-lg"
                >
                  Subcategory Name *
                </label>
                <input
                  className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                  placeholder="Enter Subcategory Name"
                  id="name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label
                  htmlFor="image"
                  className="mb-4 block font-medium md:text-lg"
                >
                  Subcategory Image (Optional)
                </label>
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
                  {loading ? "Creating..." : "Create Subcategory"}
                </button>
                <button
                  type="button"
                  className="btn-outline shadow-none"
                  onClick={() => {
                    setName("");
                    setImageFile(null);
                    router.push(
                      `/marketplace/products/categories/${categoryId}/subCategories/all`,
                    );
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

export default SubcategoryForm;
