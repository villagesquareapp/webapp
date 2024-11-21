import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { Label } from "components/ui/label";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import type { GoogleMap as GoogleMapType, LoadScript, Marker } from "@react-google-maps/api";

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

const SocialPostFilterDialog = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>();
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      setSelectedLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <HiOutlineAdjustmentsHorizontal className="size-6" />
      </DialogTrigger>
      <DialogTitle className="sr-only">Filter</DialogTitle>
      <DialogContent className="flex flex-col gap-y-4">
        <div className="gap-y-1 flex flex-col">
          <p className="font-semibold">Location</p>
          <div className="bg-accent py-3 px-4 text-sm rounded-lg">
            {selectedLocation ? selectedLocation : "Select Location"}
          </div>
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
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold">Sort By</p>
          <div className="flex flex-wrap gap-3">
            <span className="border py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              Popularity
            </span>
            <span className="border py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              Latest{" "}
            </span>
            <span className="border border-primary bg-black py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              New to Old
            </span>
            <span className="border py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              Old to New
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <p className="font-semibold">Sort By</p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">Live</p>
              <div className="flex items-center">
                <Checkbox
                  id="live"
                  className="h-6 w-6 !rounded-sm border-2 border-primary data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor="live"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">Echoes</p>
              <div className="flex items-center">
                <Checkbox
                  id="echoes"
                  className="h-6 w-6 !rounded-sm border-2 border-primary data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor="echoes"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">Post</p>
              <div className="flex items-center">
                <Checkbox
                  id="post"
                  className="h-6 w-6 !rounded-sm border-2 border-primary data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor="post"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-4 w-full">
          <Button className="w-full bg-primary/25" variant={"outline"}>
            Reset
          </Button>
          <Button className="w-full text-foreground">Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialPostFilterDialog;
