import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface LocationHook {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  hasPermission: boolean;
}

export function useLocation(): LocationHook {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (err) {
      setError('Failed to check location permissions');
    }
  };

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setHasPermission(false);
        return;
      }

      setHasPermission(true);

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const address = reverseGeocode[0];
      const formattedAddress = address 
        ? `${address.street || ''} ${address.streetNumber || ''}, ${address.postalCode || ''} ${address.city || ''}`
        : undefined;

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: formattedAddress,
      });
    } catch (err) {
      setError('Failed to get location');
      console.error('Location error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    requestLocation,
    hasPermission,
  };
}