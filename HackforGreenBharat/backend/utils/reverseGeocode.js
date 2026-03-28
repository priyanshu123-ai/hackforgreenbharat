import axios from "axios";

// In-memory cache to prevent redundant hits
const cache = new Map();

export const reverseGeocode = async (lat, lon) => {
  // Round to 3 decimal places (~110m precision) for common areas
  const roundedLat = parseFloat(lat).toFixed(3);
  const roundedLon = parseFloat(lon).toFixed(3);
  const cacheKey = `${roundedLat},${roundedLon}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const url = "https://nominatim.openstreetmap.org/reverse";

    const res = await axios.get(url, {
      params: {
        lat: lat,
        lon: lon,
        format: "json",
      },
      headers: {
        "User-Agent": "hackforgreenbharat-app-v2",
      },
      timeout: 15000, // Increased timeout
    });

    const data = res.data;
    let result = "Along Route";

    if (data && data.address) {
      result =
        data.address.suburb ||
        data.address.city_district ||
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        data.address.country ||
        "Along Route";
    }

    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error("Reverse Geocode Error:", err.message);
    return "Along Route";
  }
};