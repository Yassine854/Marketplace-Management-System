import MilRunMap from "./MilkRunMap";
// import MapBoxMap from "./MabBoxMap";
// import MapBoxMap2 from "./MapBoxMap2";
import Dropdown from "@/components/inputs/Dropdown";

import DeliveryDatePicker from "../OrderDetailsPage/DeliveryDatePicker";
import { Button } from "@nextui-org/react";

const MilkRunPage = () => {
  return (
    <div className="relative  mt-[4.8rem] flex  flex-grow p-2 ">
      <MilRunMap />
      <div className="absolute -right-4 bottom-0 left-1 z-10 flex h-20 w-full  justify-between bg-n20">
        <div className="flex">
          <div className=" mx-4 flex items-center justify-center ">
            <p className="mr-3 text-lg font-bold">Agent :</p>
            <Dropdown items={[]} />
          </div>
          <div className=" mx-4 flex items-center justify-center ">
            <p className="mr-3 text-lg font-bold">Delivery Date :</p>
            <DeliveryDatePicker />
          </div>
          <div className=" mx-4 flex items-center justify-center ">
            <p className="mr-3 text-lg font-bold">Milk Run :</p>
            <Dropdown items={[]} />
          </div>
        </div>

        <div className="flex h-full items-center justify-center  ">
          <Button className="mx-4" color="danger">
            Cancel
          </Button>
          <Button className="mx-4" color="primary">
            Validate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilkRunPage;
