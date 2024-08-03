import { useEffect, useState } from "react";
import CustomNumberInput from "./CustomNumberInput";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";

const ShippedCounter = ({ id }: any) => {
  const { orderOnReviewItems, setOrderOnReviewItems } = useOrderDetailsStore();
  const [item, setItem] = useState<any>();

  const onValueChange = (value: number) => {
    if (item && item.weight != value) {
      const items: any[] = orderOnReviewItems.map((item: any) => {
        if (item?.id === id) {
          return {
            ...item,
            weight: value,
            totalPrice: value * item.productPrice,
          };
        }
        return item;
      });
      setOrderOnReviewItems(items);
    }
  };

  useEffect(() => {
    if (orderOnReviewItems) {
      const item = orderOnReviewItems.find((item: any) => item?.id === id);
      setItem(item); //   //@ts-igno
    }
  }, [id, setItem, orderOnReviewItems]);

  return (
    <div className="flex">
      {item && (
        <CustomNumberInput
          max={item?.quantity}
          min={0}
          step={item?.pcb}
          defaultValue={item?.weight}
          onChange={onValueChange}
        />
      )}
    </div>
  );
};

export default ShippedCounter;
