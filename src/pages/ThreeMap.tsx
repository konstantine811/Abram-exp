import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import usePopuplationHistogram from "@/hooks/map-hooks/usePopulationHistogram";
import ListPlace from "@/components/map-ui/list-place";
import { ukraineBounds } from "@/config/map";

// Helper function to create square polygons

const ThreeMap = () => {
  const mapRef = useRef<Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map>();

  const { loading, places } = usePopuplationHistogram({ map });

  const orbitAngle = useRef(0);
  const isAnimatingRef = useRef(true); // Зберігаємо стан анімації через useRef
  const animationId = useRef<number | null>(null); // Зберігаємо ID анімації для можливого зупинення

  useEffect(() => {
    if (places && places.length && map) {
      isAnimatingRef.current = false; // Зупиняємо анімацію
      setTimeout(() => {
        map.fitBounds(ukraineBounds, {
          padding: { top: 10, bottom: 10, left: 10, right: 10 }, // Додає відступи для меж карти
        });
      }, 300);
    }
  }, [places, map]);

  const animateOrbit = useCallback(
    (map: Map) => {
      const radius = 30; // Радіус орбіти
      const centerLng = 0; // Довгота центру орбіти
      const centerLat = 0; // Широта центру орбіти

      // Зміна кута для обертання по орбіті
      orbitAngle.current += 0.0002;

      // Обчислення нових координат на основі кута орбіти
      const lng = centerLng + radius * Math.cos(orbitAngle.current);
      const lat = centerLat + radius * Math.sin(orbitAngle.current);

      // Оновлення положення камери
      map.setCenter([lng, lat]);
      map.setBearing(orbitAngle.current * (180 / Math.PI));
      map.setPitch(60);

      // Запланувати наступний кадр анімації, якщо вона активна
      if (isAnimatingRef.current) {
        animationId.current = requestAnimationFrame(() => animateOrbit(map));
      }
    },
    [isAnimatingRef]
  );

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
        if (mapRef.current) {
          animateOrbit(mapRef.current);
        }
      });
    }
  }, [animateOrbit]);
  return (
    <div className="min-h-screen relative">
      <div className="min-h-screen relative z-10" ref={mapContainerRef} />
      {loading && (
        <div className="fixed top-0 pointer-events-none w-full h-full z-[10000] bg-black/5  flex justify-center items-center text-black">
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
