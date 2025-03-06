import React, { useEffect } from "react";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarouselFormSchema, CarouselFormValues } from "./types";
import TextInput from "../../inputs/TextInput";
import DateInput from "../../inputs/DateInput";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";

interface CarouselModalProps {
  selectedElement: {
    _id: string;
    title: string;
    description?: string;
    clickUrl?: string[];
    startDate?: string;
    endDate?: string;
  };
  onClose: () => void;
}

const CarouselModal: React.FC<CarouselModalProps> = ({
  selectedElement,
  onClose,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CarouselFormValues>({
    resolver: zodResolver(CarouselFormSchema),
    defaultValues: {
      title: selectedElement?.title || "",
      description: selectedElement?.description || "",
      images: undefined,
      clickUrl: selectedElement?.clickUrl || [""],
      startDate: selectedElement?.startDate || "",
      endDate: selectedElement?.endDate || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "clickUrl",
  });

  const { loading, error: axiosError, fetchData } = useAxios();

  useEffect(() => {
    reset({
      title: selectedElement?.title || "",
      description: selectedElement?.description || "",
      images: undefined,
      clickUrl: selectedElement?.clickUrl || [""],
      startDate: selectedElement?.startDate || "",
      endDate: selectedElement?.endDate || "",
    });
  }, [selectedElement, reset]);

  const onSubmit: SubmitHandler<CarouselFormValues> = async (formData) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);

    Array.from(formData.images).forEach((file) => {
      data.append("images", file);
    });

    formData.clickUrl.forEach((url) => {
      if (url.trim()) {
        data.append("clickUrl", url.trim());
      }
    });

    try {
      await fetchData(`api/ad/${selectedElement._id}`, "put", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Carousel updated successfully!");

      onClose();
    } catch (error) {
      toast.error("Failed to update carousel. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <>
      <ModalHeader>
        <h2 className="text-xl font-bold">Edit Carousel</h2>
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
            isError={!!errors.title}
            errorMessage={errors.title?.message}
          />
          <TextInput
            label="Description"
            placeholder="Enter your description"
            register={register("description")}
            isError={!!errors.description}
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

          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-700">
              Click URLs
            </label>
            <button
              type="button"
              onClick={() => append("")}
              className="mt-2 flex items-center text-blue-500 transition-colors duration-200 hover:text-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add URL
            </button>

            {fields.map((field, index) => (
              <div key={field.id} className="relative">
                <div className="flex w-full items-center">
                  <TextInput
                    label=""
                    placeholder="Enter URL"
                    register={register(`clickUrl.${index}` as const)}
                    isError={!!errors.clickUrl?.[index]}
                    errorMessage={errors.clickUrl?.[index]?.message}
                    className="w-full flex-1 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute right-2 top-2 text-red-500 transition-colors duration-200 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {errors.clickUrl && (
              <p className="mt-2 text-sm text-red-600">
                {errors.clickUrl.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="images"
              className="ml-4 block font-medium md:text-lg"
            >
              Images (Select multiple)
            </label>
            <input
              id="images"
              type="file"
              multiple
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
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </ModalBody>
    </>
  );
};

export default CarouselModal;
