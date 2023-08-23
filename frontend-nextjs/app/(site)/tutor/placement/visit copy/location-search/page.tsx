"use client";

import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Marker,
} from "@react-google-maps/api";
import { l } from "drizzle-orm/query-promise.d-2e42fbc9";
import { useMemo, useState } from "react";

export function LocationSearch(props: any) {
  // const { searchAddress, searchLat, searchLng } = props;
  // const [lat, setLat] = useState(searchLat);
  // const [lng, setLng] = useState(searchLng);
  const [lat, setLat] = useState(51.5074);
  const [lng, setLng] = useState(0.1278);

  function generateRandomMarkers() {
    // For Latitude
    let lat_min = 50144589;
    let lat_max = 56678706;
    let lats = [];
    for (let i = 0; i < 100; i++) {
      let lat = {
        latitude:
          (Math.floor(Math.random() * (lat_max - lat_min + 1)) + lat_min) /
          1000000,
      };
      lats.push(lat);
    }

    // For Longitude
    let lng_min = -2858785;
    let lng_max = -368851;
    let lngs = [];
    for (let i = 0; i < 100; i++) {
      let lng = {
        longitude:
          (Math.floor(Math.random() * (lng_max - lng_min + 1)) + lng_min) /
          1000000,
      };
      lngs.push(lng);
    }

    // Combine the two arrays
    // With a shape of { id: 1, latitude: 50.575778, longitude: -2.08308, shelter: "marker 1"}
    let markers = [];
    for (let i = 0; i < 100; i++) {
      let marker = {
        id: i,
        latitude: lats[i].latitude,
        longitude: lngs[i].longitude,
        shelter: "marker " + i,
      };
      markers.push(marker);
    }

    return markers;
  }

  let markers = generateRandomMarkers();

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

  const libraries = useMemo(() => ["places"], []);
  // const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

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
            position={{ lat: marker.latitude, lng: marker.longitude }}
            key={marker.id}
            onLoad={() => console.log("Marker Loaded")}
          />
        ))}
      </GoogleMap>
    </>
  );
}
