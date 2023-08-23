"use client";

import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Marker,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

export function LocationSearch(props: any) {
  const { markers } = props;

  const libraries = useMemo(() => ["places"], []);

  // The mapCenter should cover all the markers
  const mapCenter = useMemo(() => {
    const latitudes = markers.map((marker) => marker.latitude);
    const longitudes = markers.map((marker) => marker.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    return {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };
  }, [markers]);

  // The zoom should only cover the markers with maximum zoom to completeely fit the markers
  const mapZoom = useMemo(() => {
    const latitudes = markers.map((marker) => marker.latitude);
    const longitudes = markers.map((marker) => marker.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;

    const latZoom = Math.ceil(Math.log2(360 / latDiff)) - 1;
    const lngZoom = Math.ceil(Math.log2(360 / lngDiff)) - 1;

    return Math.max(latZoom, lngZoom);
  }, [markers]);

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
        // zoom={12}
        zoom={mapZoom}
        center={mapCenter}
        // center={{ lat: 25.0391667, lng: 121.525 }}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ height: "800px" }}
        onLoad={(map) => console.log("Map Loaded")}
      >
        {/* <MarkerF
          position={mapCenter}
          onLoad={() => console.log("Marker Loaded")}
        /> */}

        {/* {props.markers.map(marker => ( */}

        {markers.map((marker) => (
          <MarkerF
            position={{
              lat: marker.latitude,
              lng: marker.longitude,
            }}
            key={marker.id}
            onLoad={() => console.log("Marker Loaded")}
          />
        ))}
      </GoogleMap>
    </>
  );
}
