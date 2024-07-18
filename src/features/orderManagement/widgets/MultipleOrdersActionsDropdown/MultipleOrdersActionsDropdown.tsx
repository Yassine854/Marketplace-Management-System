import ActionsDropdown from "../ActionsDropdown";
import Loading from "@/features/shared/elements/Loading";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useState } from "react";

export type Item = {
  name: string;
  key: string;
  action: () => void;
};

const firstItem = {
  name: "Select Action",
  action: () => {},
  key: "",
};

const MultipleOrdersActionsDropdown = ({
  actions = [],
  isPending,
  actionsRef,
}: any) => {
  const [selectedAction, setSelectedAction] = useState<Item>(firstItem);

  const onSelectedChange = (item: Item): void => {
    setSelectedAction(item);
  };

  return (
    <div className="flex items-center justify-center">
      <>
        <ActionsDropdown
          items={[firstItem, ...actions]}
          onSelectedChange={onSelectedChange}
          ref={actionsRef}
        />
        {selectedAction?.key && (
          <>
            {!isPending && (
              <button
                className="btn m-2 flex h-2 items-center  justify-center p-4"
                onClick={() => {
                  selectedAction.action();
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

export default MultipleOrdersActionsDropdown;
