import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { FeatureCollection } from "geojson";
import { Leva, useControls } from "leva";
import Geolocation from "../components/Geolocation";
import useMapThree from "@/hooks/map-hooks/useMapThree";

const SOURCE_NAMES = {
  ThreePolygons: "3d-polygon-source",
};
const ThreeMapDraw = () => {
  const mapRef = useRef<Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map>();
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  // for drawing 3d polygons
  useMapThree({ map });

  // Використовуємо Leva для контролю за кутами та інтенсивністю світла
  const { azimuthalAngle, polarAngle, intensity } = useControls({
    azimuthalAngle: { value: 200, min: 0, max: 360, step: 1 },
    polarAngle: { value: 60, min: 0, max: 90, step: 1 },
    intensity: { value: 0.8, min: 0, max: 1, step: 0.01 },
  });

  // Оновлення положення сонця при зміні контролів
  useEffect(() => {
    // console.log("on change");
    if (map) {
      // Add a directional light
      // console.log(map.getLights());
      map.setLights([
        {
          id: "flat",
          type: "flat",
          properties: {
            color: "rgba(255.0, 255.0, 0.0, 1.0)",
            intensity: intensity,
            position: [azimuthalAngle, polarAngle, 100],
          },
        },
      ]);
    }
  }, [map, azimuthalAngle, polarAngle, intensity]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia29uc3RhbnRpbmU4MTEiLCJhIjoiY2themphMDhpMGsyazJybWlpbDdmMGthdSJ9.m2RIe_g8m5dqbce0JrO73w";
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/konstantine811/clxll1zwx00eg01qqcrlphbmk",
        center: [31.1656, 48.3794],
        zoom: 5,
      });

      mapRef.current.on("load", () => {
        const map = mapRef.current;
        if (map) {
          setMap(map);

          // Add the GeoJSON source for the fill-extrusion layer
          if (!map.getSource(SOURCE_NAMES.ThreePolygons)) {
            map.addSource(SOURCE_NAMES.ThreePolygons, {
              type: "geojson",
              data: geoJsonData, // Initial empty GeoJSON data
            });
            map.addLayer({
              id: "3d-polygon",
              type: "fill-extrusion",
              source: SOURCE_NAMES.ThreePolygons,
              paint: {
                "fill-extrusion-color": "#ff0000", // Example color
                "fill-extrusion-height": 2111300, // Total height of the 3D polygon
                "fill-extrusion-base": 0, // Base height of the polygon
                "fill-extrusion-opacity": 1, // Opacity for the 3D effect
              },
            });
          }

          // Initialize Mapbox Draw controls
          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              polygon: true,
              line_string: true,
              point: true,
              trash: true,
              combine_features: true,
              uncombine_features: true,
            },
          });
          map.on("draw.create", () => {
            const polygonData = draw.getAll();
            // Update the GeoJSON data in the state
            setGeoJsonData({
              type: "FeatureCollection",
              features: polygonData.features, // Update with the drawn polygon's features
            });

            // Update the source with the new GeoJSON data
            const source = map.getSource(
              SOURCE_NAMES.ThreePolygons
            ) as mapboxgl.GeoJSONSource;
            source?.setData({
              type: "FeatureCollection",
              features: polygonData.features,
            });
          });

          map.on("draw.update", () => {
            const polygonData = draw.getAll();
            // Update the GeoJSON data in the state
            setGeoJsonData({
              type: "FeatureCollection",
              features: polygonData.features, // Update with the drawn polygon's features
            });

            // Update the source with the new GeoJSON data
            const source = map.getSource(
              SOURCE_NAMES.ThreePolygons
            ) as mapboxgl.GeoJSONSource;
            source?.setData({
              type: "FeatureCollection",
              features: polygonData.features,
            });
          });

          // Add the draw controls to the map
          map.addControl(draw);
        }
      });
    }
  }, [map, geoJsonData]);
  return (
    <div className="min-h-screen relative">
      <div className="min-h-screen relative z-10" ref={mapContainerRef} />
      <div className="absolute top-2 right-12 h-auto z-10">
        <Leva fill oneLineLabels={true} collapsed />
      </div>
      <div className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none">
        {/* {controls} */}
        {map && <Geolocation map={map} />}
      </div>
    </div>
  );
};

export default ThreeMapDraw;
