import React, { useEffect, useState } from "react";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductFormValues, ProductFormSchema } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../inputs/TextInput";
import DateInput from "../../inputs/DateInput";
import SearchSelectInput from "../../inputs/SearchSelectInput";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-hot-toast";
import FileInput from "../../inputs/FileInput";

const ProductShowcaseModal: React.FC = ({ selectedElement, onClose }) => {
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

  const { fetchData } = useAxios();

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
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const response = await fetchData(
        "api/products/search",
        "get",
        undefined,
        {
          params: { query },
          headers: {
            "X-API-Key": apiKey,
          },
        },
      );

      if (response && response.data) {
        setFilteredProducts(response.data);
      } else {
        toast.error("Failed to fetch products. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  const handleSearch = (query) => {
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

      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const response = await fetchData(
        `api/ad/${selectedElement._id}`,
        "put",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": apiKey,
          },
        },
      );

      if (response && response.data) {
        toast.success("Product showcase updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update product showcase. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update product showcase. Please try again.");
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

          <SearchSelectInput
            label="Search and Select Products"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            filteredProducts={filteredProducts}
            onSelectProduct={handleProductSelection}
            selectedProducts={selectedProducts}
            onRemoveProduct={removeSelectedProduct}
          />

          <FileInput
            id="images"
            label="Image"
            register={register}
            error={errors.images}
            accept="image/*"
          />

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
