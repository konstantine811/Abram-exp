import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import usePopuplationHistogram from "@/hooks/map-hooks/usePopulationHistogram";
import ListPlace from "@/components/map-ui/list-place";

// Helper function to create square polygons

const ThreeMap = () => {
  const mapRef = useRef<Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map>();

  const { loading, places } = usePopuplationHistogram({ map });

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
        <ListPlace map={map} places={places} />
      </div>
    </div>
  );
};

export default ThreeMap;
