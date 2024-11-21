import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const GoogleMap = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.GoogleMap),
  { ssr: false }
);

const LoadScriptComponent = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.LoadScript),
  { ssr: false }
);

const MarkerComponent = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Marker),
  { ssr: false }
);

const containerStyle = {
  width: "100%",
  height: "200px",
};

const defaultCenter = {
  lat: 51.509865,
  lng: -0.118092,
};

const mapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];

const Map = ({ onLocationSelect }: { onLocationSelect: (location: string) => void }) => {
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  }, []);

  return (
    <div className="mt-2 rounded-lg overflow-hidden">
      <LoadScriptComponent
        id="google-map-script"
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={13}
          onClick={handleMapClick}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          <MarkerComponent position={markerPosition} />
        </GoogleMap>
      </LoadScriptComponent>
    </div>
  );
};

export default Map;
