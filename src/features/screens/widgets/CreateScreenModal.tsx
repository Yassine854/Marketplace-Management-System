import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from "@nextui-org/react";

type CreateScreenModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

const screenSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type ScreenFormData = z.infer<typeof screenSchema>;

const CreateAdModal = ({ showModal, setShowModal }: CreateScreenModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScreenFormData>({
    resolver: zodResolver(screenSchema),
  });

  const onSubmit = async (data: ScreenFormData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/screen",
        {
          title: data.title,
          description: data.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setShowModal(false);
      reset();
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <ModalContent>
        <ModalHeader>Create Screen</ModalHeader>
        <ModalBody>
          <p className="mb-4 text-gray-500">Create a new Screen</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="mb-2 block">Title</label>
            <input
              type="text"
              {...register("title")}
              className="mb-4 w-full rounded-lg border p-2"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}

            <label className="mb-2 block">Description</label>
            <textarea
              {...register("description")}
              className="mb-4 w-full rounded-lg border p-2"
            ></textarea>
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}

            <ModalFooter>
              <Button color="default" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateAdModal;
