import { z } from "zod";

export const ImageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Image is required"),
  startDate: z.string(),
  endDate: z.string(),
});

export type ImageFormValues = z.infer<typeof ImageFormSchema>;
export const CarouselFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Image is required"),
  clickUrl: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
});

export type CarouselFormValues = z.infer<typeof CarouselFormSchema>;
export const ProductFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Image is required"),
  startDate: z.string(),
  endDate: z.string(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
