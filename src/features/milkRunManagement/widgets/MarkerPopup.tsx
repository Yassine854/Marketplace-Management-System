import { Button } from "@nextui-org/button";
import { Popup } from "react-map-gl";
import { IconSquareRoundedX } from "@tabler/icons-react";

const MarkerPopup = ({
  longitude,
  latitude,
  orderId,
  orderKamiounId,
  customer,
  total,
  deliveryAgentName,
  onClose,
  onDetailsClick,
}: any) => {
  return (
    <Popup
      closeButton={false}
      anchor="bottom"
      longitude={Number(longitude)}
      latitude={Number(latitude)}
      focusAfterOpen
      onClose={onClose}
    >
      <div className="mb-4 flex w-full justify-between  ">
        <IconSquareRoundedX
          stroke={2}
          size={28}
          onClick={onClose}
          className="cursor-pointer"
        />
        <Button
          size="sm"
          className="font-bold"
          color="primary"
          onClick={onDetailsClick}
        >
          Details
        </Button>
      </div>
      <div className=" font-semibold text-black">
        Order Tech ID : <span className="font-bold text-n90">#{orderId}</span>
      </div>
      <div className=" font-semibold text-black">
        Order ID : <span className="font-bold text-n90">#{orderKamiounId}</span>
      </div>
      <div className=" font-semibold text-black">
        Customer : <span className="font-bold text-n90">{customer}</span>
      </div>
      <div className=" font-semibold text-black">
        Total : <span className="font-bold text-n90">{total}</span>
      </div>
      <div className=" font-semibold text-black">
        Delivery Agent :{" "}
        <span className="font-bold text-n90">{deliveryAgentName}</span>
      </div>
    </Popup>
  );
};

export default MarkerPopup;
