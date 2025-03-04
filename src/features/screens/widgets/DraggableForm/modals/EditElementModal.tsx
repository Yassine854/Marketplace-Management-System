import React from "react";
import {
  Modal,
  Button,
  ModalFooter,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import ImageModal from "./ImageModal";
import CarouselModal from "./CarouselModal";
import ProductShowcaseModal from "./ProductShowcaseModal";
import { EditElementModalProps } from "../types";

const EditElementModal: React.FC<EditElementModalProps> = ({
  isOpen,
  onClose,
  selectedElement,
}) => {
  if (!selectedElement) return null;

  const renderModalContent = () => {
    switch (
      selectedElement.adType !== undefined
        ? selectedElement.adType
        : selectedElement.title
    ) {
      case "image":
        return <ImageModal selectedElement={selectedElement} />;
      case "carousel":
        return <CarouselModal selectedElement={selectedElement} />;
      case "ProductShowcase":
        return <ProductShowcaseModal selectedElement={selectedElement} />;
      default:
        return (
          <>
            <ModalHeader>
              <h2 className="text-xl font-bold">Edit Element</h2>
            </ModalHeader>
            <ModalBody>
              <div className="text-gray-700">
                <p>This is the default editor.</p>
                <p>No specific content type detected.</p>
              </div>
            </ModalBody>
          </>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>{renderModalContent()}</ModalContent>
    </Modal>
  );
};

export default EditElementModal;
