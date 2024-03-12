const calculateBarycenter = (coordinates) => {
  if (coordinates.length === 0) {
    return null; // Handle empty array as needed
  }

  // Calculate average latitude and longitude
  const sumLat = coordinates.reduce((sum, coord) => sum + coord.latitude, 0);
  const sumLong = coordinates.reduce((sum, coord) => sum + coord.longitude, 0);

  const avgLat = sumLat / coordinates.length;
  const avgLong = sumLong / coordinates.length;

  return {
    barycenterLatitude: parseFloat(avgLat.toFixed(4)),
    barycenterLongitude: parseFloat(avgLong.toFixed(4)),
  };
};

const toRadius = (deg) => {
  return deg * (Math.PI / 180);
};

const convertCoordsToKm = (origin, target) => {
  const R = 6371;

  const latRadians = toRadius(target.latitude - origin.latitude) / 2;
  const longRadians = toRadius(target.longitude - origin.longitude) / 2;

  const a =
    Math.pow(Math.sin(latRadians), 2) +
    Math.cos(toRadius(origin.latitude)) *
      Math.cos(toRadius(target.latitude)) *
      Math.pow(Math.sin(longRadians), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

// Example usage:
const coordinates = [
  { latitude: 40.7128, longitude: -74.006 },
  { latitude: 34.0522, longitude: -118.2437 },
  // Add more coordinates as needed
];

const barycenter = calculateBarycenter(coordinates);
// console.log("barycenter: ", barycenter);

export { calculateBarycenter, convertCoordsToKm };
