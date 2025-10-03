import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import usePopuplationHistogram from "@/hooks/map-hooks/usePopulationHistogram";
import ListPlace from "@/components/map-ui/list-place";
import { useControls } from "leva";
import { ukraineBounds } from "@/config/map";

// Helper function to create square polygons

const MAP_INIT_ZOOM = 5;
const MAP_PITCH = 60;

const ThreeMap = () => {
  const mapRef = useRef<Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map>();
  const { loading, places } = usePopuplationHistogram({ map });

  const orbitAngle = useRef(0);
  const animationId = useRef<number | null>(null); // Зберігаємо ID анімації для можливого зупинення
  const isAnimatingRef = useRef(true);
  const [{ isAnimating }, set] = useControls(() => ({
    isAnimating: { value: true, label: "Animate Orbit" },
  }));

  useEffect(() => {
    if (places && places.length && map) {
      // Виключаємо анімацію
      set({ isAnimating: false });

      setTimeout(() => {
        // Виконуємо fitBounds для встановлення меж України
        map.fitBounds(ukraineBounds, {
          padding: { top: 10, bottom: 10, left: 10, right: 10 }, // Додає відступи для меж карти
          duration: 3000,
        });
      }, 10);
    }
  }, [places, map, set]);

  function getCoordinates() {
    const radius = 30; // Радіус орбіти
    const centerLng = 0; // Довгота центру орбіти
    const centerLat = 0; // Широта центру орбіти

    // Зміна кута для обертання по орбіті
    orbitAngle.current += 0.0002;

    // Обчислення нових координат на основі кута орбіти
    const lng = centerLng + radius * Math.cos(orbitAngle.current);
    const lat = centerLat + radius * Math.sin(orbitAngle.current);
    return {
      coord: [lng, lat] as LngLatLike,
      angle: orbitAngle.current * (180 / Math.PI),
    };
  }

  const animateOrbit = useCallback((map: Map) => {
    if (!isAnimatingRef.current) return; // Якщо анімація зупинена, виходимо з функції
    const { coord, angle } = getCoordinates();
    map.setCenter(coord);
    map.setBearing(angle);
    map.setPitch(MAP_PITCH);
    map.setZoom(MAP_INIT_ZOOM);

    // Запланувати наступний кадр анімації, якщо вона активна
    animationId.current = requestAnimationFrame(() => animateOrbit(map));
  }, []);

  useEffect(() => {
    isAnimatingRef.current = isAnimating; // Оновлюємо стан анімації через ref

    if (isAnimating && map) {
      // Якщо анімація активна, перезапускаємо її
      // Зупиняємо анімацію, якщо isAnimating = false
      const { coord, angle } = getCoordinates();
      map
        .flyTo({
          center: coord,
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          bearing: angle,
          pitch: MAP_PITCH,
          zoom: MAP_INIT_ZOOM,
        })
        .once("moveend", () => {
          animateOrbit(map);
        });
    } else if (!isAnimating && animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }
  }, [isAnimating, animateOrbit, map]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia29uc3RhbnRpbmU4MTEiLCJhIjoiY2themphMDhpMGsyazJybWlpbDdmMGthdSJ9.m2RIe_g8m5dqbce0JrO73w";
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/konstantine811/clxll1zwx00eg01qqcrlphbmk",
        center: [0, 0],
        zoom: MAP_INIT_ZOOM,
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
      <div className="min-h-screen relative z-10" ref={mapContainerRef}></div>
      {loading && (
        <div className="fixed top-0 pointer-events-none w-full h-full z-[10000] bg-black/5  flex justify-center items-center text-black">
          Please wait, Loading a data
        </div>
      )}
      <div className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none">
        <ListPlace
          onStopAnimation={() => {
            set({ isAnimating: false });
          }}
          map={map}
          places={places}
        />
      </div>
    </div>
  );
};

export default ThreeMap;
