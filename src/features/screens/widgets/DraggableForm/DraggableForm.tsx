import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ElementsSection from "./ElementsSection";
import ScreenBuilderSection from "./ScreenBuilderSection";
import useAxios from "../../hooks/useAxios";

const DraggableForm = ({ elements, formElements, setFormElements }) => {
  const { fetchData } = useAxios();

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
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const response = await fetchData(
        "api/ad",
        "post",
        { adType: element.title },
        { headers: { "X-API-Key": apiKey } },
      );

      if (response && response.data) {
        const newData = response.data;
        const newElement = { ...newData, title: newData.adType };

        const newFormElements = Array.from(formElements);
        newFormElements.splice(destination.index, 0, newElement);

        setFormElements(newFormElements);
      } else {
        console.error("Failed to create new element");
      }
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
