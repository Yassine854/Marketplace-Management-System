import { useState } from "react";
import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MarkerPopup from "./MarkerPopup";
import { IconMapPinFilled, IconMapPin } from "@tabler/icons-react";
import Map, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";

const tunisLat = 36.70972;
const tunisLng = 10.174644;
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MilkRunMap = ({
  onEditClick,
  ordersMarkers,
  onOrderMarkerClick,
  selectedOrdersIds,
}: any) => {
  const [popupInfo, setPopupInfo] = useState<any>(null);

  const [viewState, setViewState] = useState({
    zoom: 10,
    latitude: tunisLat,
    longitude: tunisLng,
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
          <Marker
            //@ts-ignore
            cursor={"pointer"}
            key={marker.order_id}
            latitude={marker.latitude}
            longitude={marker.longitude}
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              onOrderMarkerClick(marker.order_id);
            }}
          >
            <div
              key={marker.order_id}
              onMouseEnter={() => {
                setPopupInfo(marker);
              }}
            >
              {selectedOrdersIds.includes(marker.order_id) && (
                <IconMapPinFilled size={38} />
              )}
              {!selectedOrdersIds.includes(marker.order_id) && (
                <IconMapPin size={38} />
              )}
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <MarkerPopup
            onClose={() => {
              setPopupInfo(null);
            }}
            orderId={popupInfo?.order_id}
            customer={popupInfo?.creator}
            latitude={popupInfo?.latitude}
            total={popupInfo?.order_amount}
            longitude={popupInfo?.longitude}
            orderKamiounId={popupInfo?.kamioun_order_id}
            deliveryAgentName={popupInfo?.delivery_agent}
            onEditClick={() => onEditClick(popupInfo?.order_id)}
          />
        )}
      </div>
    </Map>
  );
};

export default MilkRunMap;
