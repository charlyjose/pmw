"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { Input } from "@/registry/new-york/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";


import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export function LocationSearch(props: any) {
  const [lat, setLat] = useState(52.620674);
  const [lng, setLng] = useState(-1.125511);

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
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

  const sendBackData = (address: string, lat: number, lng: number) => {
    props.orgLocationName(address);
    props.orgLocationLat(lat);
    props.orgLocationLng(lng);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-2">
          <CardHeader className="space-y-1 p-0">
            <CardTitle className="text-sm font-medium">Location Search</CardTitle>
            <CardDescription>Search your placement location</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-0 pt-2">
            {/* render Places Auto Complete and pass custom handler which updates the state */}
            <PlacesAutocomplete
              onAddressSelect={(address) => {
                getGeocode({ address: address }).then((results) => {
                  const { lat, lng } = getLatLng(results[0]);
                  setLat(lat);
                  setLng(lng);
                  sendBackData(address, lat, lng);
                });
              }}
            />
          </CardContent>
        </div>

        <div className="col-span-5">
          <GoogleMap
            options={mapOptions}
            zoom={14}
            center={mapCenter}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{ width: "1200px", height: "430px" }}
            onLoad={(map) => console.log("Map Loaded")}
          >
            <MarkerF
              position={mapCenter}
              onLoad={() => console.log("Marker Loaded")}
            />
          </GoogleMap>
        </div>
      </div>
    </>
  );
}

const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      //   componentRestrictions: {
      //     country: "uk",
      //   },
    },
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <CommandItem>
          <span
            key={place_id}
            onClick={() => {
              setValue(description, false);
              clearSuggestions();
              onAddressSelect && onAddressSelect(description);
            }}
          >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </span>
        </CommandItem>
      );
    });
  };

  return (
    <>
      <div>
        <Input
          value={value}
          disabled={!ready}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          type="text"
          placeholder="Search Google Maps"
          required
        />
      </div>
      <Command className="rounded-lg shadow-md">
        {status === "OK" && (
          <ScrollArea className="h-36 rounded-md border">
            <CommandList>
              <CommandGroup heading="Suggestions">
                {renderSuggestions()}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        )}
      </Command>
    </>
  );
};
