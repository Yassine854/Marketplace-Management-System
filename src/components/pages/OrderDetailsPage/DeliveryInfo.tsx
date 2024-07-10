import { IconTruckDelivery } from "@tabler/icons-react";
import DeliveryDatePicker from "./DeliveryDatePicker";

const DeliveryInfo = ({
  deliveryAgent,
  deliveryDate,
  onDeliveryDateChange,
}: any) => {
  return (
    <div className=" ml-12 flex h-32">
      <div className="">
        <div className="   flex  h-16 w-16  items-center justify-center rounded-full bg-n30 ">
          <IconTruckDelivery stroke={2} size={48} />
        </div>
      </div>

      <div className="ml-4  flex h-full w-full flex-grow flex-col  ">
        <p className=" pb-2 text-2xl font-bold text-black">Delivery Info</p>
        <p className="text-black  ">
          <span className="text-n90 ">Delivery Agent :</span>{" "}
          {deliveryAgent || "*****"}
        </p>
        <div className=" flex items-center justify-between   ">
          <p className="text-black  ">
            <span className="text-n90 ">Delivery Date :</span>{" "}
            {!deliveryDate && "*****"}
          </p>
          {!!deliveryDate && (
            <DeliveryDatePicker
              onChange={onDeliveryDateChange}
              defaultValue={deliveryDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
