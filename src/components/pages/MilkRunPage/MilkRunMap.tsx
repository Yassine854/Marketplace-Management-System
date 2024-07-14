import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { Marker, Popup } from "react-map-gl";
import { IconMapPinFilled, IconMapPin } from "@tabler/icons-react";
import Map, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const tunisLat = 36.70972;
const tunisLng = 10.174644;

const MilkRunMap = ({
  children,
  ordersMarkers,
  onOrderMarkerClick,
  selectedOrdersIds,
}: any) => {
  const [popupInfo, setPopupInfo] = useState<any>(null);

  useEffect(() => {
    console.log("🚀 ~ popupInfo:", popupInfo);
  }, [popupInfo]);

  const [viewState, setViewState] = useState({
    latitude: tunisLat,
    longitude: tunisLng,
    zoom: 10,
  });

  return (
    <Map
      {...viewState}
      onMove={(event) => setViewState(event.viewState)}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={token}
    >
      <GeolocateControl />
      <FullscreenControl />
      <NavigationControl />
      <div>
        {ordersMarkers?.map((marker: any) => (
          <div
            key={marker.order_id}
            className="cursor-pointer"
            onMouseEnter={() => {
              setPopupInfo(marker);
            }}
            onMouseLeave={() => {
              setPopupInfo(null);
            }}
          >
            <Marker
              cursor={"pointer"}
              key={marker.order_id}
              longitude={marker.longitude}
              latitude={marker.latitude}
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                onOrderMarkerClick(marker.order_id);
                console.log("🚀 ~ MapMarkers ~ marker:", marker);
              }}
            >
              {selectedOrdersIds.includes(marker.order_id) && (
                <IconMapPinFilled size={38} />
              )}
              {!selectedOrdersIds.includes(marker.order_id) && (
                <IconMapPin size={38} />
              )}
            </Marker>
          </div>
        ))}

        {popupInfo && (
          <Popup
            className="w-96"
            anchor="top"
            longitude={Number(popupInfo?.longitude)}
            latitude={Number(popupInfo?.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div className="text-lg font-semibold text-black">
              Order Tech ID :{" "}
              <span className="font-bold text-n90">#{popupInfo.order_id}</span>
            </div>
            <div className="text-lg font-semibold text-black">
              Order ID :{" "}
              <span className="font-bold text-n90">
                #{popupInfo.kamioun_order_id}
              </span>
            </div>
            <div className="text-lg font-semibold text-black">
              Customer :{" "}
              <span className="font-bold text-n90">{popupInfo.creator}</span>
            </div>
            <div className="text-lg font-semibold text-black">
              Total :{" "}
              <span className="font-bold text-n90">
                {popupInfo.order_amount}
              </span>
            </div>
            <div className="text-lg font-semibold text-black">
              Delivery Agent :{" "}
              <span className="font-bold text-n90">
                {popupInfo.delivery_agent}
              </span>
            </div>
          </Popup>
        )}
      </div>
    </Map>
  );
};

export default MilkRunMap;
