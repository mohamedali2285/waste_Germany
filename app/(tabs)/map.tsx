import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { MapPin, Clock, Phone, Navigation, Locate } from 'lucide-react-native';
import { useLocation } from '@/hooks/useLocation';
import { mapsUtils } from '@/utils/maps';

const facilityTypes = [
  { id: 'all', name: 'Alle', color: '#666' },
  { id: 'recycling', name: 'Recycling-Zentren', color: '#228B22' },
  { id: 'glass', name: 'Glascontainer', color: '#90EE90' },
  { id: 'clothing', name: 'Altkleider', color: '#4169E1' },
  { id: 'hazardous', name: 'Sondermüll', color: '#FF6347' },
];

const nearbyFacilities = [
  {
    id: 1,
    name: 'Wertstoffhof Heidenheim',
    type: 'Recycling Center',
    distance: '0.8 km',
    address: 'Industriestraße 15, 89522 Heidenheim an der Brenz',
    hours: 'Mo-Fr: 8:00-18:00, Sa: 8:00-14:00',
    phone: '+49 7321 327-0',
    acceptedWaste: ['Electronics', 'Furniture', 'Garden waste', 'Metal'],
    color: '#228B22',
  },
  {
    id: 2,
    name: 'Glascontainer Schnaitheim',
    type: 'Glass Collection',
    distance: '0.3 km',
    address: 'Hauptstraße 45, 89520 Heidenheim an der Brenz',
    hours: '24/7',
    acceptedWaste: ['Clear glass', 'Brown glass', 'Green glass'],
    color: '#90EE90',
  },
  {
    id: 3,
    name: 'Altkleidercontainer Mergelstetten',
    type: 'Clothing Collection',
    distance: '0.5 km',
    address: 'Zöschinger Straße 12, 89522 Heidenheim an der Brenz',
    hours: '24/7',
    acceptedWaste: ['Clean clothing', 'Shoes', 'Bags', 'Textiles'],
    color: '#4169E1',
  },
  {
    id: 4,
    name: 'Schadstoffmobil Collection Point',
    type: 'Hazardous Waste',
    distance: '1.2 km',
    address: 'Rathaus Heidenheim, Grabenstraße 15, 89522 Heidenheim an der Brenz',
    hours: 'Next visit: Fr, 31 Jan 9:00-12:00',
    acceptedWaste: ['Batteries', 'Paint', 'Chemicals', 'Light bulbs'],
    color: '#FF6347',
  },
  {
    id: 5,
    name: 'Wertstoffhof Oggenhausen',
    type: 'Recycling Center',
    distance: '2.1 km',
    address: 'Oggenhausen 25, 89522 Heidenheim an der Brenz',
    hours: 'Mo-Sa: 7:00-19:00',
    phone: '+49 7321 327-100',
    acceptedWaste: ['Large appliances', 'Mattresses', 'Tires', 'Construction waste'],
    color: '#228B22',
  },
];

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { location, requestLocation, hasPermission, loading } = useLocation();

  const handleGetDirections = async (facility: any) => {
    try {
      let mapsUrl = '';
      
      if (location) {
        // Use current location as starting point
        mapsUrl = `https://www.google.com/maps/dir/${location.latitude},${location.longitude}/${encodeURIComponent(facility.address)}`;
      } else {
        // Just show the destination
        mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(facility.address)}`;
      }
      
      const canOpen = await Linking.canOpenURL(mapsUrl);
      if (canOpen) {
        await Linking.openURL(mapsUrl);
      } else {
        Alert.alert('Error', 'Cannot open maps application');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open directions. Please try again.');
    }
  };

  const handleMapPress = async () => {
    try {
      const centerLocation = location || {
        latitude: 48.6761,
        longitude: 10.1522,
        address: 'Heidenheim an der Brenz'
      };
      
      let mapsUrl = `https://www.google.com/maps/search/recycling+facilities+near+${encodeURIComponent(centerLocation.address || 'Heidenheim an der Brenz')}`;
      
      const canOpen = await Linking.canOpenURL(mapsUrl);
      if (canOpen) {
        await Linking.openURL(mapsUrl);
      } else {
        Alert.alert('Error', 'Cannot open maps application');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open map. Please try again.');
    }
  };
  const handleLocationRequest = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Location Permission',
        'Allow location access to show nearby facilities and get accurate directions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Allow', onPress: requestLocation },
        ]
      );
    } else {
      await requestLocation();
    }
  };

  const filteredFacilities = selectedFilter === 'all' 
    ? nearbyFacilities 
    : nearbyFacilities.filter(facility => {
        switch (selectedFilter) {
          case 'recycling':
            return facility.type === 'Recycling Center';
          case 'glass':
            return facility.type === 'Glass Collection';
          case 'clothing':
            return facility.type === 'Clothing Collection';
          case 'hazardous':
            return facility.type === 'Hazardous Waste';
          default:
            return true;
        }
      });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Recycling-Anlagen</Text>
          <Text style={styles.subtitle}>Finden Sie Sammelstellen in Ihrer Nähe</Text>
        </View>
        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={handleLocationRequest}
          disabled={loading}
        >
          <Locate size={20} color={loading ? "#ccc" : "#228B22"} />
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {facilityTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterPill,
              selectedFilter === type.id && styles.activeFilterPill,
              selectedFilter === type.id && { backgroundColor: type.color }
            ]}
            onPress={() => setSelectedFilter(type.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === type.id && styles.activeFilterText
            ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map Placeholder */}
      <TouchableOpacity style={styles.mapPlaceholder} onPress={handleMapPress}>
        <MapPin size={48} color="#228B22" />
        <Text style={styles.mapPlaceholderText}>Interaktive Kartenansicht</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Zeigt {filteredFacilities.length} Anlagen
          {location?.address ? ` near ${location.address.split(',')[0]}` : ' in Heidenheim an der Brenz'}
        </Text>
        <Text style={styles.tapToOpenText}>Tippen, um in Google Maps zu öffnen</Text>
      </TouchableOpacity>

      {/* Facilities List */}
      <ScrollView style={styles.facilitiesContainer}>
        <Text style={styles.listTitle}>Anlagen in der Nähe</Text>
        {filteredFacilities.map((facility) => (
          <TouchableOpacity key={facility.id} style={styles.facilityCard}>
            <View style={styles.facilityHeader}>
              <View style={styles.facilityTitleContainer}>
                <View style={[styles.facilityTypeIndicator, { backgroundColor: facility.color }]} />
                <View style={styles.facilityInfo}>
                  <Text style={styles.facilityName}>{facility.name}</Text>
                  <Text style={styles.facilityType}>{facility.type}</Text>
                </View>
              </View>
              <Text style={styles.distance}>{facility.distance}</Text>
            </View>

            <View style={styles.facilityDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#666" />
                <Text style={styles.detailText}>{facility.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#666" />
                <Text style={styles.detailText}>{facility.hours}</Text>
              </View>
              {facility.phone && (
                <View style={styles.detailRow}>
                  <Phone size={16} color="#666" />
                  <Text style={styles.detailText}>{facility.phone}</Text>
                </View>
              )}
            </View>

            <View style={styles.wasteTypesContainer}>
              <Text style={styles.wasteTypesTitle}>Angenommener Müll:</Text>
              <View style={styles.wasteTypesTags}>
                {facility.acceptedWaste.slice(0, 3).map((waste, index) => (
                  <View key={index} style={styles.wasteTag}>
                    <Text style={styles.wasteTagText}>{waste}</Text>
                  </View>
                ))}
                {facility.acceptedWaste.length > 3 && (
                  <View style={styles.wasteTag}>
                    <Text style={styles.wasteTagText}>+{facility.acceptedWaste.length - 3}</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => handleGetDirections(facility)}
            >
              <Navigation size={16} color="#228B22" />
              <Text style={styles.directionsText}>Route anzeigen</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  locationButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f0f8f0',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  activeFilterPill: {
    backgroundColor: '#228B22',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#228B22',
    marginTop: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tapToOpenText: {
    fontSize: 12,
    color: '#228B22',
    marginTop: 8,
    fontWeight: '500',
  },
  facilitiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  facilityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  facilityTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  facilityTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  facilityType: {
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#228B22',
  },
  facilityDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  wasteTypesContainer: {
    marginBottom: 16,
  },
  wasteTypesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  wasteTypesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wasteTag: {
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  wasteTagText: {
    fontSize: 12,
    color: '#228B22',
    fontWeight: '500',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#228B22',
    marginLeft: 8,
  },
});
