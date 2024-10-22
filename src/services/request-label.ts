import axios from "axios";
import { API_QUERIES, API_URL } from "../config/api";
import { IPlaceData } from "../models/server-data/place.model";
import { IOverpassApiResponse } from "../models/server-data/overpass.model";
import db from "./indexed-db";

// Function to make the Axios POST request
export async function fetchUkrainePlaces() {
  const cachedData = await db.places.toArray();
  if (cachedData.length) {
    return cachedData[0].data; // Return the cached data
  }
  try {
    const response = await axios.post<IOverpassApiResponse>(
      API_URL.overpass,
      `data=${encodeURIComponent(API_QUERIES.places)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Extract and process the data
    const places = response.data.elements
      .map((place) => {
        if (place.tags && place.lat && place.lon) {
          return {
            id: place.id,
            name: place.tags.name,
            type: place.tags.place, // 'city', 'town', or 'village'
            lat: place.lat,
            lon: place.lon,
            population: place.tags.population,
          } as IPlaceData;
        }
      })
      .filter((i) => i) as IPlaceData[];
    if (places.length) {
      await db.places.clear();
      // Cache the places data in IndexedDB
      await db.places.add({
        data: places,
        timestamp: new Date().toISOString(),
      });
    }

    return places;
  } catch (error) {
    console.error("Error fetching data from Overpass API:", error);
  }
}
