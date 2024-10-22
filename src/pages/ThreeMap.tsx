import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import { fetchUkrainePlaces } from "../services/request-label";
import { IPlaceData } from "../models/server-data/place.model";
import { FeatureCollection } from "geojson";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import ListboxWrapper from "../components/ListboxWrapper";
import useVirtualScroll from "../hooks/useVirtualScroll";

// Helper function to create square polygons
function createSquare(center: [number, number], sizeInMeters: number) {
  const earthRadius = 6378137; // Earth's radius in meters
  const lat = center[1];
  const lon = center[0];

  // Convert size from meters to degrees
  const sizeInDegrees = (sizeInMeters / earthRadius) * (180 / Math.PI);

  const halfSize = sizeInDegrees / 2;

  return {
    type: "Polygon",
    coordinates: [
      [
        [lon - halfSize, lat - halfSize],
        [lon + halfSize, lat - halfSize],
        [lon + halfSize, lat + halfSize],
        [lon - halfSize, lat + halfSize],
        [lon - halfSize, lat - halfSize], // Close the polygon
      ],
    ],
  };
}

const ThreeMap = () => {
  const mapRef = useRef<Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map>();
  const listWrapRef = useRef<HTMLDivElement | null>(null);
  const [places, setPlaces] = useState<IPlaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollData } = useVirtualScroll<IPlaceData>({
    array: places,
    childHeight: 40,
    ref: listWrapRef,
  });

  useEffect(() => {
    if (map && places && places.length) {
      // Convert city data to GeoJSON
      const populations = places.map((city) => parseInt(city.population, 10));
      const maxPopulation = Math.max(...populations);
      const minPopulation = Math.min(...populations);
      const newMin = 0; // The minimum value for normalization
      const newMax = 300000; // The maximum value for normalization
      const geojson = {
        type: "FeatureCollection",
        features: places.map((city) => {
          const population = parseInt(city.population, 10);

          // Normalize population value between newMin and newMax
          const normalizedPopulation =
            ((population - minPopulation) / (maxPopulation - minPopulation)) *
              (newMax - newMin) +
            newMin;

          // Calculate polygon size based on normalized population
          let sizeInMeters = 500;
          if (normalizedPopulation > 10000) {
            sizeInMeters = 8000;
          } else if (normalizedPopulation > 1000) {
            sizeInMeters = 4000;
          } else if (normalizedPopulation > 100) {
            sizeInMeters = 3000;
          } else if (normalizedPopulation < 100) {
            sizeInMeters = 1000;
          }
          return {
            type: "Feature",
            geometry: createSquare([city.lon, city.lat], sizeInMeters),
            properties: {
              ...city,
              population: city.population,
              normalizedPopulation: normalizedPopulation,
            },
          };
        }),
      } as FeatureCollection;
      if (!map.getSource("cities")) {
        const layers = map.getStyle()?.layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
        )?.id;
        map.addSource("cities", {
          type: "geojson",
          data: geojson,
        });
        // Add the fill-extrusion layer
        map.addLayer(
          {
            id: "city-extrusion",
            type: "fill-extrusion",
            source: "cities",
            maxzoom: 22,
            minzoom: 0,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "normalizedPopulation"],
                newMin,
                "#00008b", // Dark blue for min population
                newMax,
                "#8b0000", // "Blood red" for max population
              ],
              "fill-extrusion-height": ["get", "normalizedPopulation"],
              "fill-extrusion-base": 0, // Optional, sets the base extrusion height
            },
          },
          labelLayerId
        );

        map.addLayer(
          {
            id: "population-labels",
            type: "symbol",
            source: "cities",
            layout: {
              "text-field": ["get", "population"], // Use population as the label
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 12,
            },
            paint: {
              "text-color": "#bef264", // Set label color
              "text-opacity": 0.3,
            },
          },
          labelLayerId // Insert this label layer above the 3D polygons but below other labels
        );
      }
    }
  }, [map, places]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchUkrainePlaces();
        if (data) {
          const sortedData = data.sort((a, b) => {
            const popA =
              Number(a.population.replace(/[^0-9]/g, "").trim()) || 0;
            const popB =
              Number(b.population.replace(/[^0-9]/g, "").trim()) || 0;
            return popB - popA;
          });
          setPlaces(sortedData);
        }
      } catch (err) {
        console.log("err", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia29uc3RhbnRpbmU4MTEiLCJhIjoiY2themphMDhpMGsyazJybWlpbDdmMGthdSJ9.m2RIe_g8m5dqbce0JrO73w";
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [31.1656, 48.3794],
        zoom: 5,
      });
      mapRef.current.on("load", () => {
        setMap(mapRef.current);
      });
    }
  }, []);
  return (
    <div className="min-h-screen relative">
      <div className="min-h-screen relative z-10" ref={mapContainerRef} />
      {loading && (
        <div className="fixed top-0 w-full h-full z-[10000] bg-black/15 backdrop-blur-sm flex justify-center items-center text-black">
          Please wait, Loading a data
        </div>
      )}
      <div className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none">
        <div className="w-full h-full flex">
          <ListboxWrapper
            ref={listWrapRef}
            className="pointer-events-auto m-2 shadow-2xl bg-content1 justify-self-end overflow-auto max-w-[150px] hidden sm:block"
          >
            <Listbox aria-label="Actions">
              {scrollData.map((place, index) => {
                return (
                  <ListboxItem
                    description={place.population}
                    key={place.id}
                    value={place.id}
                    onClick={() => {
                      map?.flyTo({
                        center: [place.lon, place.lat], // Longitude first, then latitude
                        zoom: 12, // Adjust the zoom level as needed
                        speed: 1.5, // Optional: Adjust the speed of the transition
                        curve: 1, // Optional: Customize the animation curve
                        essential: true, // This ensures the transition occurs even if the user has set prefers-reduced-motion
                      });
                    }}
                  >
                    <div className="flex gap-1">
                      <span className="text-green-200">{index + 1}.</span>
                      <p>{place.name}</p>
                    </div>
                  </ListboxItem>
                );
              })}
            </Listbox>
          </ListboxWrapper>
        </div>
      </div>
    </div>
  );
};

export default ThreeMap;
