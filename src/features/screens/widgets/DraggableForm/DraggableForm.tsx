import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ElementsSection from "./ElementsSection";
import ScreenBuilderSection from "./ScreenBuilderSection";
import axios from "axios";

const DraggableForm = ({ elements, formElements, setFormElements }) => {
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      destination.droppableId !== "formElements" ||
      formElements.length >= 2
    ) {
      return;
    }

    const element = elements.find((el) => el.id === result.draggableId);

    try {
      const response = await axios.post("http://localhost:3000/api/ad", {
        adType: element.title,
      });

      const newData = response.data;

      const newElement = { ...newData, title: newData.adType };

      const newFormElements = Array.from(formElements);
      newFormElements.splice(destination.index, 0, newElement);

      setFormElements(newFormElements);
    } catch (error) {
      console.error("Error creating new element:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full">
        <ElementsSection elements={elements} />
        <ScreenBuilderSection
          formElements={formElements}
          setFormElements={setFormElements}
        />
      </div>
    </DragDropContext>
  );
};

export default DraggableForm;
