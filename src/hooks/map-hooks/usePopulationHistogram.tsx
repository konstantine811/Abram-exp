import { useControls } from "leva";
import { Map } from "mapbox-gl";
import { useEffect } from "react";
import useFetchPopulationPlace from "../fetch-data/useFetchPopulationPlace";
import { FeatureCollection } from "geojson";
import { createMultipleExtrusions } from "@/utils/map/create-histogram-population";

interface Props {
  map: Map | undefined;
}

const usePopuplationHistogram = ({ map }: Props) => {
  const { places, loading } = useFetchPopulationPlace();
  // Використовуємо Leva для контролю за кутами та інтенсивністю світла
  const { cellSize, gap, maxHeight, buildMaxHeight } = useControls({
    cellSize: { value: 1000, min: 500, max: 30000, step: 1 },
    gap: { value: 100, min: 0, max: 10000, step: 1 },
    maxHeight: { value: 244500, min: 10000, max: 1000000, step: 10 },
    buildMaxHeight: { value: 7720, min: 1000, max: 100000, step: 10 },
  });

  useEffect(() => {
    if (map && places && places.length) {
      // Перетворюємо дані в GeoJSON формат на основі cellSize
      const newMin = 0;
      const newMax = buildMaxHeight;
      const populations = places.map((city) => parseInt(city.population, 10));
      const maxPopulation = Math.max(...populations);
      const minPopulation = Math.min(...populations);
      const features = places
        .map((city) => {
          return createMultipleExtrusions({
            center: [city.lon, city.lat],
            totalPopulation: Number(city.population.replace(/[^0-9]/g, "")),
            maxHeight: newMax,
            cellSize, // Використовуємо динамічне значення cellSize
            name: city.name,
            gap,
            minPopulation,
            maxPopulation,
            newMax: maxHeight,
            newMin: 0,
          });
        })
        .flat(1);

      const geojson = {
        type: "FeatureCollection",
        features: features,
      } as FeatureCollection;

      // Оновлюємо джерело даних Mapbox
      if (map.getSource("cities")) {
        (map.getSource("cities") as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource("cities", {
          type: "geojson",
          data: geojson,
        });

        // Додаємо шари з екструдованими моделями та лейбами
        map.addLayer({
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
              "#172554",
              maxHeight / 4,
              "#4f46e5",
              maxHeight / 2,
              "#5eead4",
              maxHeight,
              "#e11d48",
            ],
            "fill-extrusion-height": ["get", "normalizedPopulation"],
            "fill-extrusion-base": 0,
          },
        });

        map.addLayer({
          id: "population-labels",
          type: "symbol",
          source: "cities",
          minzoom: 10,
          layout: {
            "text-field": ["get", "population"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 8,
            "symbol-z-elevate": true,
            "symbol-z-order": "viewport-y",
            "text-allow-overlap": true,
            "text-offset": [0, -4],
          },
          paint: {
            "text-color": "#86efac",
            "text-opacity": 0.8,
          },
          filter: ["==", "isTopRank", true],
        });

        map.addLayer({
          id: "name-labels",
          type: "symbol",
          source: "cities",
          minzoom: 10,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 9,
            "symbol-z-elevate": true,
            "symbol-z-order": "viewport-y",
            "text-offset": [0, -2],
          },
          paint: {
            "text-color": "#FFFFFF",
            "text-opacity": 0.5,
          },
          filter: ["==", "isTopRank", true],
        });
      }
    }
  }, [map, places, cellSize, gap, buildMaxHeight, maxHeight]); // Додаємо залежність на `cellSize`
  return { loading, places };
};

export default usePopuplationHistogram;
