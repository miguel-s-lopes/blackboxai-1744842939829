import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface Location {
  latitude: number;
  longitude: number;
  place_name?: string;
  properties?: Record<string, any>;
  address?: string;
  accuracy?: number;
}

interface RouteInfo {
  route: [number, number][];
  distance: number;
  duration: number;
}

type TravelMode = 'driving' | 'walking' | 'cycling';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWlndWVsLWxvcGVzIiwiYSI6ImNsd3FweGhsMjA1NDAyanNhajV1YWNjcHEifQ.1CAh2fdXiJ9FlWcyqwNf8w';

export default function useMap() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get coordinates from address
  const geocodeAddress = useCallback(async (address: string): Promise<Location | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_TOKEN}`
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return {
          longitude,
          latitude,
          place_name: data.features[0].place_name,
          properties: data.features[0].properties,
        };
      }

      throw new Error('No results found');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get route between two points
  const getRoute = useCallback(async (start: Location, end: Location): Promise<RouteInfo | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${
          start.latitude
        };${end.longitude},${
          end.latitude
        }?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );

      if (!response.ok) {
        throw new Error('Route calculation failed');
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        return {
          route: data.routes[0].geometry.coordinates,
          distance: data.routes[0].distance,
          duration: data.routes[0].duration,
        };
      }

      throw new Error('No route found');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocode to get address
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
            );

            if (!response.ok) {
              throw new Error('Reverse geocoding failed');
            }

            const data = await response.json();
            
            resolve({
              latitude,
              longitude,
              address: data.features[0]?.place_name || 'Unknown location',
              accuracy: position.coords.accuracy,
            });
          } catch (err) {
            reject(err instanceof Error ? err : new Error('An error occurred'));
          }
        },
        (err) => {
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((start: Location, end: Location): number => {
    if (!start || !end) return 0;

    // Convert coordinates to radians
    const toRad = (value: number): number => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const lat1 = toRad(start.latitude);
    const lon1 = toRad(start.longitude);
    const lat2 = toRad(end.latitude);
    const lon2 = toRad(end.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Returns distance in kilometers
  }, []);

  // Format distance for display
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${Math.round(distance * 10) / 10} km`;
  }, []);

  // Estimate travel time based on distance and mode
  const estimateTravelTime = useCallback((distance: number, mode: TravelMode = 'driving'): string => {
    const speeds: Record<TravelMode, number> = {
      driving: 40, // km/h
      walking: 5,  // km/h
      cycling: 15, // km/h
    };

    const speed = speeds[mode] || speeds.driving;
    const timeInHours = distance / speed;
    const timeInMinutes = timeInHours * 60;

    if (timeInMinutes < 1) {
      return 'Less than a minute';
    }
    if (timeInMinutes < 60) {
      return `${Math.round(timeInMinutes)} mins`;
    }
    return `${Math.floor(timeInHours)}h ${Math.round((timeInHours % 1) * 60)}m`;
  }, []);

  return {
    loading,
    error,
    geocodeAddress,
    getRoute,
    getCurrentLocation,
    calculateDistance,
    formatDistance,
    estimateTravelTime,
  };
}
