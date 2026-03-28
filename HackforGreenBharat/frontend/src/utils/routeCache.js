const TTL = 10 * 60 * 1000; // 10 minutes

export const getCachedRoute = (origin, destination) => {
  const key = `route_v14:${origin?.toLowerCase()}:${destination?.toLowerCase()}`;
  const raw = localStorage.getItem(key);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (Date.now() - parsed.timestamp > TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const setCachedRoute = (origin, destination, data) => {
  const key = `route_v14:${origin?.toLowerCase()}:${destination?.toLowerCase()}`;
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch (e) {
    console.warn("Local storage quota exceeded, skipping cache for this route.", e);
    // Optional: could try to clear oldest entries here
  }
};
