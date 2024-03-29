"use client";

import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo, useState } from "react";

export function LocationSearch(props: any) {
  const { searchAddress, searchLat, searchLng } = props;
  const [lat, setLat] = useState(searchLat);
  const [lng, setLng] = useState(searchLng);

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      draggable: true,
      zoomControl: true,
      fullscreenControl: true,
      mapTypeControl: true,
      // streetViewControl: true,
      zoomControlOptions: {
        // position: google.maps.ControlPosition.RIGHT_CENTER,
        position: 7.0,
      },
      mapTypeControlOptions: {
        // position: google.maps.ControlPosition.LEFT_TOP,
        position: 5.0,
      },
      // streetViewControlOptions: {
      //   position: google.maps.ControlPosition.RIGHT_BOTTOM,
      // },
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ height: "530px" }}
        onLoad={(map) => console.log("Map Loaded")}
      >
        <MarkerF
          position={mapCenter}
          onLoad={() => console.log("Marker Loaded")}
        />
      </GoogleMap>
    </>
  );
}
