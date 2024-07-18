import { useEffect } from "react";
import Dropdown from "./Dropdown";
import Loading from "@/features/shared/elements/Loading";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";

const ActionsDropdown = ({ actions, isPending, orderId }: any) => {
  const { selectedAction, setSelectedAction, setIsInEditMode, isInEditMode } =
    useOrderDetailsStore();

  useEffect(() => {
    if (isInEditMode) {
      const item = actions.find((e: any) => {
        return e.key === "edit";
      });
      setSelectedAction(item);
    }
    //D'ont add dependencies
  }, []);

  useEffect(() => {
    if (selectedAction?.key === "edit") {
      setIsInEditMode(true);
    } else {
      setIsInEditMode(false);
    }
  }, [selectedAction, setIsInEditMode]);

  return (
    <div className="flex items-center justify-center">
      <>
        <Dropdown
          items={actions}
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
        {selectedAction?.key && (
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
