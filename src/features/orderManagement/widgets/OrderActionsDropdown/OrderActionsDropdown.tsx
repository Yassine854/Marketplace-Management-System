import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import Loading from "@/components/elements/Loading";
import { useOrderDetailsStore } from "@/stores/orderDetailsStore";

const ActionsDropdown = ({ actions, isPending, orderId }: any) => {
  const { selectedAction, setSelectedAction, isInEditMode } =
    useOrderDetailsStore();

  // if (isInEditMode) {
  //   const editAction = actions.find((action: any) => action?.key == "edit");
  //   console.log("🚀 ~ useEffect ~ editAction:", editAction);
  //   setSelectedAction(editAction);
  // }

  return (
    <div className="flex items-center justify-center">
      <>
        <Dropdown
          items={actions}
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
        {selectedAction && (
          <>
            {!isPending && (
              <button
                className="btn m-2 flex h-2 items-center  justify-center p-4"
                onClick={() => {
                  selectedAction.action(orderId);
                }}
              >
                Confirm
              </button>
            )}
            {isPending && (
              <div className="ml-4 h-8 w-8 ">
                <Loading />
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default ActionsDropdown;
