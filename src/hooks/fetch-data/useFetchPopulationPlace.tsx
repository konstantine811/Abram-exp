import { useEffect, useState } from "react";
import { fetchUkrainePlaces } from "../../services/request-label";
import { IPlaceData } from "../../models/server-data/place.model";

const useFetchPopulationPlace = () => {
  const [places, setPlaces] = useState<IPlaceData[]>([]);
  const [loading, setLoading] = useState(true);
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
  return { places, loading };
};

export default useFetchPopulationPlace;
