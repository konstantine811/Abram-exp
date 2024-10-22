import { Map } from "mapbox-gl";
import { useEffect, useState } from "react";

interface Props {
  map: Map;
}

enum SourceNames {
  GpsPoint = "gps-point",
}
const GeolocationExample = ({ map }: Props) => {
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    error: string | null;
  }>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (map.getSource(SourceNames.GpsPoint)) return;
    map.addSource(SourceNames.GpsPoint, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [location.longitude || 0, location.latitude || 0],
            },
            properties: {},
          },
        ],
      },
    });

    // Додаємо шар для точки
    map.addLayer({
      id: "gps-point-layer",
      type: "circle",
      source: "gps-point",
      paint: {
        "circle-radius": 10,
        "circle-color": "#ff0000", // Червона точка
      },
    });
  }, [map, location]);

  useEffect(() => {
    // Функція для обробки успішного отримання позиції
    const handlePositionUpdate: PositionCallback = (position) => {
      const { latitude, longitude } = position.coords;
      // Оновлюємо джерело даних для нових координат
      const source = map.getSource(
        SourceNames.GpsPoint
      ) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              properties: {},
            },
          ],
        });
      }
      // Наближаємо камеру до об'єкта та повертаємо її
      map.flyTo({
        center: [longitude, latitude],
        zoom: 18, // Наближаємось
        pitch: 60, // Нахиляємо камеру
        bearing: 45, // Поворот
        speed: 1.2, // Швидкість руху камери
      });
      setLocation({
        latitude,
        longitude,
        error: null,
      });
    };

    // Функція для обробки помилок
    const handleError: PositionErrorCallback = (error) => {
      setLocation({
        latitude: null,
        longitude: null,
        error: error.message,
      });
    };

    if (navigator.geolocation) {
      // Використовуємо watchPosition для отримання оновлень у реальному часі
      navigator.geolocation.watchPosition(handlePositionUpdate, handleError, {
        enableHighAccuracy: true, // Висока точність
        timeout: 500, // Максимальний час очікування
        maximumAge: 0, // Не використовувати кешовані дані
      });
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      });
    }

    // Очищуємо стеження за позицією при розмонтуванні компонента
  }, []);

  return (
    <div>
      <h2>GPS Position</h2>
      {location.latitude && location.longitude ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        <p className="text-red-400">
          {location.error ? location.error : "No location available"}
        </p>
      )}
    </div>
  );
};

export default GeolocationExample;
