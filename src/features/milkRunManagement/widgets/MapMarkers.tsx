import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { Marker, Popup } from "react-map-gl";

const MapMarkers = ({ markers, onMarkerClick, onMarkerHover }: any) => {
  console.log("🚀 ~ MapMarkers ~ markers:", markers);
  const [popupInfo, setPopupInfo] = useState<any>(null);

  return (
    <div>
      {markers?.map((marker: any) => (
        <div
          key={marker.order_id}
          className="cursor-pointer"
          onMouseEnter={() => setPopupInfo(marker)}
          onMouseLeave={() => setPopupInfo(null)}
        >
          <Marker
            key={marker.order_id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              onMarkerClick(marker.order_id);
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
          <div>{`Marker ID: ${popupInfo.order_id}`}</div>
        </Popup>
      )}
    </div>
  );
};

export default MapMarkers;
