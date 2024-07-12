import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import axios from "axios";

import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const tunisLat = 36.70972;
const tunisLng = 10.174644;

const prodBaseUrl = "https://debbou.kamioun.com";
const magentoToken = process.env.NEXT_PUBLIC_MAGENTO_TOKEN;

const magentoClient = axios.create({
  baseURL: prodBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${magentoToken}`,
  },
});

const markers = [{ id: "1", lat: 36.70972, lng: 10.174644 }];
const MapMarkers = () => {
  const [dataMarkers, setDataMarkers] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any>(null);

  useEffect(() => {
    magentoClient
      .get(
        "/rest/default/V1/orders/list/per_delivery_date?deliveryDate=15/07/2024",
      )
      .then((e) => {
        setDataMarkers(e.data);
        console.log("🚀 ~ useEffect ~ e:", e);
      });
  }, []);

  return (
    <div>
      {dataMarkers.map((dataMarker) => (
        <div className="cursor-pointer" key={dataMarker.id}>
          <Marker
            key={dataMarker.id}
            longitude={dataMarker.longitude}
            latitude={dataMarker.latitude}
            onMarkerHover={(e: any) => {
              // If we let the click event propagates to the map, it will immediately close the popup
              // with `closeOnClick: true`
              e.originalEvent.stopPropagation();
              setPopupInfo(dataMarker);
            }}
          >
            <Image
              src="/marker.png"
              className="rounded-full"
              width={48}
              height={48}
              alt="marker"
            />
          </Marker>
        </div>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo?.longitude)}
          latitude={Number(popupInfo?.latitude)}
          onClose={() => setPopupInfo(null)}
        >
          <div>Hello World from Popup</div>
        </Popup>
      )}
    </div>
  );
};

const MilkRunMap = () => {
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

      <MapMarkers />
    </Map>
  );
};

export default MilkRunMap;
