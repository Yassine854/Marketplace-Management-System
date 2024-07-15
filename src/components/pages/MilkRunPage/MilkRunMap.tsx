import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { IconMapPinFilled, IconMapPin } from "@tabler/icons-react";
import Map, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import { Marker } from "react-map-gl";
import MarkerPopup from "./MarkerPopup";

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const tunisLat = 36.70972;
const tunisLng = 10.174644;

const MilkRunMap = ({
  ordersMarkers,
  onOrderMarkerClick,
  selectedOrdersIds,
}: any) => {
  const [popupInfo, setPopupInfo] = useState<any>(null);

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
          <Marker
            cursor={"pointer"}
            key={marker.order_id}
            longitude={marker.longitude}
            latitude={marker.latitude}
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
            longitude={popupInfo?.longitude}
            latitude={popupInfo?.latitude}
            orderId={popupInfo?.order_id}
            orderKamiounId={popupInfo?.kamioun_order_id}
            total={popupInfo?.order_amount}
            customer={popupInfo?.creator}
            deliveryAgent={popupInfo?.delivery_agent}
          />
        )}
      </div>
    </Map>
  );
};

export default MilkRunMap;
