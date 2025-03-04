import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import EditElementModal from "./modals/EditElementModal";
import axios from "axios";

const ScreenBuilderSection = ({ formElements, setFormElements }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleElementClick = (element) => {
    setSelectedElement(element);
    setIsModalOpen(true);
  };
  const handleDeleteElement = async (elementId) => {
    try {
      await axios.delete(`http://localhost:3000/api/ad/${elementId}`);

      const updatedElements = formElements.filter(
        (element) => element._id !== elementId,
      );
      setFormElements(updatedElements);
    } catch (error) {
      console.error("Error deleting element:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedElement(null);
  };

  return (
    <>
      <Droppable droppableId="formElements">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full rounded bg-black bg-opacity-50 p-4"
          >
            <h2 className="mb-4 text-xl font-bold">Screen Builder</h2>
            {formElements.map((element, index) => (
              <Draggable
                key={element.id}
                draggableId={element.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2 cursor-move rounded bg-white p-2 shadow"
                    onClick={() => handleElementClick(element)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-gray-700">{element.title}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(element._id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Click for properties or drag to move
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {formElements.length >= 2 && (
              <div className="mt-2 text-red-500">
                Maximum of 2 ad reached. Remove an ad to add a new one.
              </div>
            )}
          </div>
        )}
      </Droppable>

      <EditElementModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedElement={selectedElement}
      />
    </>
  );
};

export default ScreenBuilderSection;
