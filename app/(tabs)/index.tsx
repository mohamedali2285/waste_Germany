import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Bell, Calendar as CalendarIcon, MapPin, Navigation } from 'lucide-react-native';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useWasteSchedule } from '@/hooks/useWasteSchedule';
import { useLocation } from '@/hooks/useLocation';
import { storage } from '@/utils/storage';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { currentDate, currentDay, monthName, dayName } = useCurrentDate();
  const { wasteTypes, upcomingCollections, notifications, setNotifications } = useWasteSchedule();
  const { location, requestLocation, hasPermission } = useLocation();

  // Create calendar mapping from enabled waste types
  const calendarWasteTypes = wasteTypes.reduce((acc, waste) => {
    if (waste.dayOfMonth > 0) {
      acc[waste.dayOfMonth] = { type: waste.name, color: waste.color };
    }
    return acc;
  }, {} as { [key: number]: { type: string; color: string } });

  const handleLocationRequest = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Location Permission',
        'This app needs location access to show nearby facilities and provide accurate collection schedules.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Allow', onPress: requestLocation },
        ]
      );
    } else {
      await requestLocation();
    }
  };

  const handleBellPress = async () => {
    Alert.alert(
      'Benachrichtigungen verwalten',
      'Wählen Sie, für welche Müllarten Sie Erinnerungen erhalten möchten:',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Zu Profil', onPress: () => {/* Navigate to profile */} },
      ]
    );
  };

  const handleReminderPress = async (wasteType: string) => {
    const typeMap: { [key: string]: keyof typeof notifications } = {
      'Restmüll': 'restmuell',
      'Biomüll': 'biomuell',
      'Papier': 'papier',
      'Gelber Sack': 'gelberSack',
    };
    
    const notificationKey = typeMap[wasteType];
    if (notificationKey) {
      const newNotifications = {
        ...notifications,
        [notificationKey]: !notifications[notificationKey]
      };
      setNotifications(newNotifications);
      await storage.saveNotifications(newNotifications);
      
      Alert.alert(
        'Erinnerung aktualisiert',
        `${wasteType} Erinnerungen ${newNotifications[notificationKey] ? 'aktiviert' : 'deaktiviert'}`
      );
    }
  };

  const getCalendarDayStyle = (day: number) => {
    const wasteInfo = calendarWasteTypes[day as keyof typeof calendarWasteTypes];
    if (day === currentDay) {
      return styles.currentDay;
    } else if (wasteInfo) {
      return [styles.collectionDay, { backgroundColor: wasteInfo.color + '40', borderColor: wasteInfo.color }];
    }
    return styles.calendarDay;
  };

  const getCalendarDayTextStyle = (day: number) => {
    const wasteInfo = calendarWasteTypes[day as keyof typeof calendarWasteTypes];
    if (day === currentDay) {
      return styles.currentDayText;
    } else if (wasteInfo) {
      return [styles.collectionDayText, { color: wasteInfo.color }];
    }
    return styles.calendarDayText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>WasteWise Germany</Text>
            <TouchableOpacity onPress={handleLocationRequest}>
              <Text style={styles.subtitle}>
                {location?.address || 'Heidenheim an der Brenz, 89522'} 
                {!hasPermission && ' (Tap to enable location)'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleBellPress}>
            <Bell size={24} color="#228B22" />
          </TouchableOpacity>
        </View>

        {/* Quick Overview Cards */}
        <View style={styles.quickOverview}>
          <Text style={styles.sectionTitle}>Waste Collection Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wasteCardsContainer}>
            {wasteTypes.map((waste) => (
              <TouchableOpacity key={waste.id} style={[styles.wasteCard, { borderLeftColor: waste.color }]}>
                <View style={[styles.wasteIndicator, { backgroundColor: waste.color }]} />
                <Text style={styles.wasteType}>{waste.name}</Text>
                <Text style={styles.nextDate}>{waste.nextDate}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Collections */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Collections</Text>
          {upcomingCollections.map((collection, index) => (
            <TouchableOpacity key={index} style={styles.collectionItem}>
              <View style={[styles.colorIndicator, { backgroundColor: collection.color }]} />
              <View style={styles.collectionDetails}>
                <Text style={styles.collectionType}>{collection.type}</Text>
                <Text style={styles.collectionDate}>{collection.date}</Text>
                <Text style={styles.collectionTime}>Collection starts at {collection.time}</Text>
              </View>
              <TouchableOpacity 
                style={styles.reminderButton}
                onPress={() => handleReminderPress(collection.type)}
              >
                <Bell 
                  size={16} 
                  color={notifications[Object.keys(notifications).find(key => 
                    collection.type === (key === 'restmuell' ? 'Restmüll' : 
                                       key === 'biomuell' ? 'Biomüll' : 
                                       key === 'papier' ? 'Papier' : 
                                       key === 'gelberSack' ? 'Gelber Sack' : 'Altglas')
                  ) || 'restmuell'] ? '#228B22' : '#ccc'} 
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendar View */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Text style={styles.sectionTitle}>{monthName} {currentDate.getFullYear()}</Text>
            <Text style={styles.currentDateInfo}>Today: {dayName}, {currentDay}.</Text>
          </View>
          <View style={styles.calendarGrid}>
            {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => (
              <TouchableOpacity
                key={day}
                style={getCalendarDayStyle(day)}
                onPress={() => setSelectedDate(day.toString())}
              >
                <Text style={getCalendarDayTextStyle(day)}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8f0',
  },
  quickOverview: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  wasteCardsContainer: {
    flexDirection: 'row',
  },
  wasteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wasteIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  wasteType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  nextDate: {
    fontSize: 12,
    color: '#666',
  },
  upcomingSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  collectionDetails: {
    flex: 1,
  },
  collectionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  collectionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  collectionTime: {
    fontSize: 12,
    color: '#999',
  },
  reminderButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  calendarSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentDateInfo: {
    fontSize: 14,
    color: '#228B22',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDay: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  currentDay: {
    backgroundColor: '#228B22',
  },
  collectionDay: {
    borderWidth: 2,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#333',
  },
  currentDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  collectionDayText: {
    fontWeight: 'bold',
  },
});