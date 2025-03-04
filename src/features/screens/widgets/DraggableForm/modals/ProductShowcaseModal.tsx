import React, { useEffect, useState } from "react";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductFormValues, ProductFormSchema } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import TextInput from "@/features/shared/inputs/TextInput";
import DateInput from "./DateInput";

const ProductShowcaseModal: React.FC = ({ selectedElement }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: selectedElement.title,
      description: selectedElement.description || "",
      images: [],
      products: [],
      startDate: selectedElement.startDate || "",
      endDate: selectedElement.endDate || "",
    },
  });

  useEffect(() => {
    reset({
      title: selectedElement.title,
      description: selectedElement.description || "",
      images: [],
      products: selectedProducts,
      startDate: selectedElement.startDate || "",
      endDate: selectedElement.endDate || "",
    });
  }, [selectedElement, reset, selectedProducts]);

  const fetchFilteredProducts = async (query) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/products/search",
        {
          params: { query },
        },
      );
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      fetchFilteredProducts(query);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductSelection = (product) => {
    if (!selectedProducts.some((p) => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setSearchQuery("");
    setFilteredProducts([]);
  };

  const removeSelectedProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (formData) => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("startDate", startDate);
      data.append("endDate", endDate);

      const productIds = selectedProducts.map((product) => product._id);
      data.append("products", JSON.stringify(productIds));

      Array.from(formData.images).forEach((file) => {
        data.append("backgroundImage", file);
      });

      const response = await axios.put(
        `http://localhost:3000/api/ad/${selectedElement._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <>
      <ModalHeader>
        <h2 className="text-xl font-bold">Edit Product Showcase</h2>
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-10 pb-10"
        >
          <TextInput
            label="Title"
            placeholder="Enter your Title"
            register={register("title")}
            isError={errors.title}
            errorMessage={errors.title?.message}
          />
          <TextInput
            label="Description"
            placeholder="Enter your description"
            register={register("description")}
            isError={errors.description}
            errorMessage={errors.description?.message}
          />

          <div>
            <label className="block font-medium md:text-lg">Start Date</label>
            <DateInput
              value={startDate}
              onChange={(date) => setValue("startDate", date)}
              placeholder="Select start date"
            />
            {errors.startDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium md:text-lg">End Date</label>
            <DateInput
              value={endDate}
              onChange={(date) => setValue("endDate", date)}
              placeholder="Select end date"
            />
            {errors.endDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="ml-4 block font-medium md:text-lg">
              Search and Select Products
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-3xl border border-n30 bg-n0 px-3 py-2 text-sm focus:outline-none dark:border-n500 dark:bg-bg4 md:px-6 md:py-3"
            />
            <div className="mt-2">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductSelection(product)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {product.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="ml-4 block font-medium md:text-lg">
              Selected Products
            </label>
            <div className="mt-2">
              {selectedProducts.map((product) => (
                <div
                  key={product._id}
                  className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-2"
                >
                  <span>{product.name}</span>
                  <button
                    type="button"
                    onClick={() => removeSelectedProduct(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="ml-4 block font-medium md:text-lg"
            >
              Background image
            </label>
            <input
              id="images"
              type="file"
              {...register("images")}
              className="mt-1 block w-full sm:text-sm"
            />
            {errors.images && (
              <p className="mt-2 text-sm text-red-600">
                {errors.images.message}
              </p>
            )}
          </div>

          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </ModalBody>
    </>
  );
};

export default ProductShowcaseModal;
