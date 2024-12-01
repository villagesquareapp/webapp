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

const Map = ({
  onLocationSelect,
}: {
  // onLocationSelect: (location: {
  //   coordinates: string;
  //   state: string;
  //   country: string;
  // }) => void;
  onLocationSelect: (location: string) => void;
}) => {
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng && map && window.google) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });

        try {
          const geocoder = new window.google.maps.Geocoder();
          const response = await geocoder.geocode({
            location: { lat, lng },
          });

          if (response.results[0]) {
            let state = "";
            let country = "";

            response.results[0].address_components.forEach((component) => {
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
              if (component.types.includes("country")) {
                country = component.long_name;
              }
            });

            // onLocationSelect({
            //   coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            //   state,
            //   country,
            // });
            onLocationSelect(`${state}, ${country}`);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          // onLocationSelect({
          //   coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          //   state: "",
          //   country: "",
          // });
          onLocationSelect("");
        }
      }
    },
    [map, onLocationSelect]
  );

  return (
    <div className="mt-2 rounded-lg overflow-hidden">
      {/* <LoadScriptComponent
        id="google-map-script"
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={13}
          onClick={handleMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          <MarkerComponent position={markerPosition} />
        </GoogleMap>
      </LoadScriptComponent> */}
    </div>
  );
};

export default Map;
