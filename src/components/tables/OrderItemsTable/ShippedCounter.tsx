import { Button } from "@nextui-org/react";
import { useShippedCounter } from "./useShippedCounter";

const ShippedCounter = ({ id }: any) => {
  const { decrementShipped, incrementShipped, item } = useShippedCounter(id);

  return (
    <div className="flex">
      <Button onClick={() => incrementShipped(id)} size="sm">
        <p className="text-xl font-bold">+</p>
      </Button>
      <input
        className="mx-2 w-8 rounded-lg text-center font-bold"
        type="number"
        //@ts-ignore
        value={item?.shipped || 0}
        onChange={(v) => {
          console.log("🚀 ~ ShippedCounter ~ v:", v);
        }}
      />
      <Button className="link" onClick={() => decrementShipped(id)} size="sm">
        <p className="text-xl font-bold">-</p>
      </Button>
    </div>
  );
};

export default ShippedCounter;
