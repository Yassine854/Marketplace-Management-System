import Map, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MarkerPopup from "./MarkerPopup";
import { IconMapPinFilled, IconMapPin } from "@tabler/icons-react";

const tunisLat = 36.70972;
const tunisLng = 10.174644;
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/*
   milkRunOrder={
    "created_at": "2024-07-15 14:18:49",
    "delivery_slot": "morning",
    "delivery_agent": "Vague 1",
    "creator": "Abir Hasni",
    "delivery_status": "",
    "delivery_agent_id": 6626,
    "creator_id": 6148,
    "order_id": 64347,
    "name": "Abir Hasni",
    "zone": "103, Av L'Environnement, Ezzahra 2034**",
    "signin_phone_number": "22191844",
    "status": "shipped",
    "state": "new",
    "longitude": 10.318403430283,
    "latitude": 36.735027123387,
    "order_amount": 337.57,
    "kamioun_order_id": "000053377"
}
  */

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
      {ordersMarkers.length && (
        <div>
          {[...ordersMarkers].map((marker: any) => {
            if (!marker.latitude && !marker.longitude) {
              return null;
            }
            return (
              <Marker
                //@ts-ignore
                cursor={"pointer"}
                key={marker.orderId}
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
                    <IconMapPinFilled
                      size={38}
                      className="[&_path]:fill-green-700"
                    />
                  )}
                  {!selectedOrdersIds.includes(marker.order_id) && (
                    <IconMapPin size={38} className="[&_path]:green-700" />
                  )}
                </div>
              </Marker>
            );
          })}

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
      )}
    </Map>
  );
};

export default MilkRunMap;
