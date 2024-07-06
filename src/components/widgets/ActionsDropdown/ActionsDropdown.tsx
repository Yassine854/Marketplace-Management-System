import { useState, useRef, useEffect } from "react";
import Dropdown from "@/components/inputs/Dropdown";
import Loading from "@/components/elements/Loading";

const ActionsDropdown = ({ actions, isPending, dropRef, orderId }: any) => {
  const [selectedAction, setSelectedAction] = useState("");

  useEffect(() => {
    !isPending && setSelectedAction("");
  }, [isPending, setSelectedAction]);

  return (
    <div className="flex items-center justify-center">
      <>
        <Dropdown
          items={actions}
          onSelectedChange={setSelectedAction}
          ref={dropRef}
        />
        {selectedAction && (
          <>
            {!isPending && (
              <button
                className="btn m-2 flex h-2 items-center  justify-center p-4"
                onClick={() => {
                  const selected = actions.find(
                    (action: any) => action.key === selectedAction,
                  );
                  selected.action(orderId);
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
