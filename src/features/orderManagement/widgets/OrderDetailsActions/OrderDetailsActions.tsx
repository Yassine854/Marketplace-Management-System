import { IconBrightnessAuto } from "@tabler/icons-react";
import Loading from "@/features/shared/elements/Loading";
import Dropdown from "../Dropdown";
import { useEffect, useState } from "react";
import { useOrderDetailsStore } from "../../stores/orderDetailsStore";

//To Refactor
const OrderDetailsActions = ({ orderId, dropRef, isPending, actions }: any) => {
  const [selectedAction, setSelectedAction] = useState<any>();
  const { setIsInEditMode, isInEditMode } = useOrderDetailsStore();

  // useEffect(() => {

  //   if (isInEditMode) {
  //     const item = actions.find((e: any) => e.key === "edit");
  //     setSelectedAction(item);
  //   }
  // }, []);

  useEffect(() => {
    if (
      isInEditMode === false &&
      selectedAction &&
      selectedAction?.key === "edit"
    ) {
      setIsInEditMode(true);
    }

    if (
      isInEditMode === true &&
      selectedAction &&
      selectedAction?.key !== "edit"
    ) {
      setIsInEditMode(false);
    }
  }, [selectedAction, isInEditMode, setIsInEditMode]);

  // useEffect(() => {
  //   if (isInEditMode) {
  //     const item = actions.find((e: any) => e.key === "edit");
  //     setSelectedAction(item || null);
  //   }
  // }, [isInEditMode, actions]);

  // useEffect(() => {
  //   if (selectedAction) {
  //     setIsInEditMode(selectedAction.key === "edit");
  //   }
  // }, [selectedAction, setIsInEditMode]);

  return (
    <div className="flex">
      <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
        <IconBrightnessAuto stroke={2} size={48} />
      </div>

      <div className=" ml-2">
        <p className=" ml-2 pb-2 text-2xl font-bold text-black">Actions </p>
        <div className="flex items-center justify-center">
          <>
            {actions && (
              <Dropdown
                ref={dropRef}
                items={actions}
                selected={selectedAction}
                onSelect={setSelectedAction}
                placeholder={!isInEditMode ? "Select Action" : undefined}
              />
            )}

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
      </div>
    </div>
  );
};

export default OrderDetailsActions;
