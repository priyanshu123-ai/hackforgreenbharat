import axios from "axios";

export const getAQIByCoords = async (lat, lon) => {
  try {
    // Use Open-Meteo Air Quality API because it's free, doesn't require a key, and is reliable
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality`;
    const res = await axios.get(url, {
      params: {
        latitude: lat,
        longitude: lon,
        current: "us_aqi",
      },
      timeout: 5000,
    });

    if (res.data && res.data.current && res.data.current.us_aqi !== undefined) {
      return { aqi: res.data.current.us_aqi };
    }

    return { aqi: null };
  } catch (error) {
    console.error("AQI fetch error:", error.message);
    return { aqi: null };
  }
};