import React, { useState, useEffect } from "react";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageFormSchema, ImageFormValues } from "./types";
import TextInput from "../../inputs/TextInput";
import DateInput from "../../inputs/DateInput";
import FileInput from "../../inputs/FileInput"; // Import the custom FileInput
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-hot-toast";

const ImageModal: React.FC = ({ selectedElement, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ImageFormValues>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues: {
      title: selectedElement.title,
      description: selectedElement.description || "",
      images: [],
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
      startDate: selectedElement.startDate || "",
      endDate: selectedElement.endDate || "",
    });
  }, [selectedElement, reset]);

  const onSubmit: SubmitHandler<ImageFormValues> = async (formData) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("startDate", startDate);
    data.append("endDate", endDate);
    Array.from(formData.images).forEach((file) => {
      data.append("images", file);
    });

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    try {
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
        toast.success("Image updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update image. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update image. Please try again.");
    }
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <>
      <ModalHeader>
        <h2 className="text-xl font-bold">Edit Image</h2>
      </ModalHeader>
      <ModalBody className="h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-5 pb-20"
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
          <FileInput
            id="images"
            label="Image"
            register={register}
            error={errors.images}
            accept="image/*"
          />
          <div className="flex w-full justify-end pt-20">
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

export default ImageModal;
