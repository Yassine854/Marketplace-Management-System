import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

import { useShippedCounter } from "./useShippedCounter";

const ShippedCounter = ({ id, shipped, pcb }: any) => {
  const max = shipped;

  const { decrementShipped, incrementShipped, item, itemBeforeEdit } =
    useShippedCounter({
      pcb,
      id,
    });

  const min = 0;

  return (
    <div className="flex">
      <Button
        onClick={() => {
          //@ts-ignore
          if (item?.shipped === itemBeforeEdit.shipped) {
            toast.error("You can't add more");
          } else {
            //@ts-ignore
            incrementShipped(id, item?.pcb);
          }
        }}
        size="sm"
      >
        <p className="text-xl font-bold">+</p>
      </Button>
      <input
        className="mx-2 w-8 rounded-lg text-center font-bold"
        type="number"
        //@ts-ignore
        value={item?.shipped || 0}
      />
      <Button
        className="link"
        onClick={() => {
          //@ts-ignore
          if (item?.shipped === min) {
            toast.error("You can't remove more");
          } else {
            //@ts-ignore
            decrementShipped(id);
          }
        }}
        size="sm"
      >
        <p className="text-xl font-bold">-</p>
      </Button>
    </div>
  );
};

export default ShippedCounter;
