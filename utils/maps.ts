import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

export interface MapLocation {
  latitude?: number;
  longitude?: number;
  address: string;
}

export const mapsUtils = {
  async openDirections(destination: MapLocation, origin?: MapLocation) {
    try {
      let url: string;

      if (Platform.OS === 'web') {
        // For web, use Google Maps web interface
        const destinationQuery = encodeURIComponent(destination.address);
        const originQuery = origin ? encodeURIComponent(origin.address) : '';
        
        if (originQuery) {
          url = `https://www.google.com/maps/dir/${originQuery}/${destinationQuery}`;
        } else {
          url = `https://www.google.com/maps/search/${destinationQuery}`;
        }
        
        await WebBrowser.openBrowserAsync(url);
      } else {
        // For mobile, try to open native maps app
        const destinationCoords = destination.latitude && destination.longitude
          ? `${destination.latitude},${destination.longitude}`
          : encodeURIComponent(destination.address);
        
        if (Platform.OS === 'ios') {
          url = `maps://app?daddr=${destinationCoords}`;
          if (origin?.latitude && origin?.longitude) {
            url += `&saddr=${origin.latitude},${origin.longitude}`;
          }
        } else {
          // Android
          url = `google.navigation:q=${destinationCoords}`;
          if (origin?.latitude && origin?.longitude) {
            url = `google.navigation:q=${destinationCoords}&saddr=${origin.latitude},${origin.longitude}`;
          }
        }
        
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      // Fallback to Google Maps web
      const destinationQuery = encodeURIComponent(destination.address);
      const fallbackUrl = `https://www.google.com/maps/search/${destinationQuery}`;
      await WebBrowser.openBrowserAsync(fallbackUrl);
    }
  },

  async openLocation(location: MapLocation) {
    try {
      const query = location.latitude && location.longitude
        ? `${location.latitude},${location.longitude}`
        : encodeURIComponent(location.address);
      
      const url = `https://www.google.com/maps/search/${query}`;
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error opening location:', error);
    }
  },
};