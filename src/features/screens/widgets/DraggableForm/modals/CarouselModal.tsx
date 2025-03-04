import React, { useEffect } from "react";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { CarouselFormSchema, CarouselFormValues } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import TextInput from "@/features/shared/inputs/TextInput";
import DateInput from "./DateInput"; // Import the custom DateInput

interface CarouselModalProps {
  selectedElement: {
    _id: string;
    title: string;
    description?: string;
    clickUrl?: string[];
    startDate?: string; // Expects a string
    endDate?: string; // Expects a string
  };
}

const CarouselModal: React.FC<CarouselModalProps> = ({ selectedElement }) => {
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
    try {
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

      const response = await axios.put(
        `http://localhost:3000/api/ad/${selectedElement._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } catch (error) {
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

          <div>
            <label className="block font-medium md:text-lg">Click URLs</label>
            {fields.map((field, index) => (
              <div key={field.id} className="mt-2 flex items-center space-x-2">
                <TextInput
                  label=""
                  placeholder="Enter URL"
                  register={register(`clickUrl.${index}` as const)}
                  isError={!!errors.clickUrl?.[index]}
                  errorMessage={errors.clickUrl?.[index]?.message}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append("")}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              Add URL
            </button>
            {errors.clickUrl && (
              <p className="mt-2 text-sm text-red-600">
                {errors.clickUrl.message}
              </p>
            )}
          </div>

          {/* Image Input */}
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

export default CarouselModal;
