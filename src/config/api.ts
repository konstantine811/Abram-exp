export const API_URL = {
  overpass: "https://overpass-api.de/api/interpreter",
};

export const API_QUERIES = {
  places: `
  [out:json][timeout:1800];
  area["ISO3166-1"="UA"]->.boundaryarea;
  (
    node["place"~"city|town|village"](area.boundaryarea)["population"];
    way["place"~"city|town|village"](area.boundaryarea)["population"];
    relation["place"~"city|town|village"](area.boundaryarea)["population"];
  );
  out center;
  `,
};
