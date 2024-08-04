import { useState } from "react";
import Dropdown from "../Dropdown";
import Loading from "@/features/shared/elements/Loading";

const MultipleOrdersActionsDropdown = ({
  actions = [],
  isPending,
  actionsRef,
}: any) => {
  const [selectedAction, setSelectedAction] = useState<any>();

  return (
    <div className="flex items-center justify-center">
      <>
        <Dropdown
          items={actions}
          ref={actionsRef}
          selected={selectedAction}
          placeholder="Select Action"
          onSelect={setSelectedAction}
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
