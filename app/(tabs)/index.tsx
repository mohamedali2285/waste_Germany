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
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useWasteSchedule } from '@/hooks/useWasteSchedule';
import { useLocation } from '@/hooks/useLocation';
import { storage } from '@/utils/storage';
import { getScheduleByPostcode } from '@/utils/garbageSchedules';

export default function CalendarScreen() {
  const { currentDate, currentDay, currentMonth, currentYear, dayName } = useCurrentDate();
  const { 
    wasteTypes, 
    upcomingCollections, 
    yearCalendarData, 
    notifications, 
    setNotifications,
    userAddress,
    updateAddressAndSchedule 
  } = useWasteSchedule();
  const { location, requestLocation, hasPermission } = useLocation();

  const [visibleMonthIndex, setVisibleMonthIndex] = useState(currentMonth);
  const [visibleYear, setVisibleYear] = useState(currentYear);

  const handleLocationRequest = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Standortberechtigung',
        'Diese App benötigt Standortzugriff, um nahegelegene Einrichtungen anzuzeigen und genaue Abholpläne bereitzustellen.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Zulassen', onPress: requestLocation },
        ]
      );
    } else {
      await requestLocation();
      
      // Update address and schedule based on location
      if (location?.address) {
        const parts = location.address.split(',');
        if (parts.length >= 2) {
          const streetPart = parts[0].trim();
          const cityPart = parts[1].trim();
          const postcodeMatch = cityPart.match(/^\d{5}/);
          
          if (postcodeMatch) {
            const newAddress = {
              street: streetPart.replace(/\d+$/, '').trim(),
              houseNumber: streetPart.match(/\d+$/) ? streetPart.match(/\d+$/)![0] : '',
              postcode: postcodeMatch[0],
              city: cityPart.replace(/^\d{5}\s*/, ''),
            };
            
            // Check if we have a schedule for this postcode
            const schedule = getScheduleByPostcode(newAddress.postcode);
            if (schedule) {
              await updateAddressAndSchedule(newAddress);
              Alert.alert(
                'Standort aktualisiert',
                `Abfallplan für ${schedule.city} wurde geladen.`
              );
            } else {
              Alert.alert(
                'Standort nicht gefunden',
                `Für die Postleitzahl ${newAddress.postcode} wurde kein Abfallplan gefunden. Es wird der Standardplan verwendet.`
              );
            }
          } else {
            Alert.alert(
              'Postleitzahl nicht erkannt',
              'Die Postleitzahl konnte aus Ihrem Standort nicht extrahiert werden.'
            );
          }
        } else {
          Alert.alert(
            'Standortdetails unvollständig',
            'Die Standortinformationen sind nicht detailliert genug, um eine Adresse zu bestimmen.'
          );
        }
      } else {
        Alert.alert(
          'Standort nicht verfügbar',
          'Ihr Standort konnte nicht abgerufen werden. Bitte versuchen Sie es erneut.'
        );
      }
    }
  };

  const handleBellPress = async () => {
    Alert.alert(
      'Erinnerungen verwalten',
      'Gehen Sie zu Ihrem Profil, um Erinnerungen für verschiedene Müllarten zu aktivieren oder zu deaktivieren.',
      [
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const handleReminderPress = async (wasteType: string) => {
    const typeMap: { [key: string]: keyof typeof notifications } = {
      'Restmüll': 'restmuell',
      'Biomüll': 'biomuell',
      'Papier': 'papier',
      'Gelber Sack': 'gelberSack',
      'Altglas': 'altglas',
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

  const getCalendarDayStyle = (day: number, month: number) => {
    const wasteInfo = yearCalendarData[month]?.[day];
    const isCurrentDay = day === currentDay && month === currentMonth && visibleYear === currentYear;

    if (isCurrentDay) {
      return styles.currentDay;
    } else if (wasteInfo && wasteInfo.length > 0) {
      // If multiple collections on one day, use the first color or a mixed color
      const firstColor = wasteInfo[0].color;
      return [styles.collectionDay, { backgroundColor: firstColor + '40', borderColor: firstColor }];
    }
    return styles.calendarDay;
  };

  const getCalendarDayTextStyle = (day: number, month: number) => {
    const wasteInfo = yearCalendarData[month]?.[day];
    const isCurrentDay = day === currentDay && month === currentMonth && visibleYear === currentYear;

    if (isCurrentDay) {
      return styles.currentDayText;
    } else if (wasteInfo && wasteInfo.length > 0) {
      const firstColor = wasteInfo[0].color;
      return [styles.collectionDayText, { color: firstColor }];
    }
    return styles.calendarDayText;
  };

  const getMonthName = (monthIndex: number) => {
    const date = new Date(visibleYear, monthIndex, 1);
    return date.toLocaleDateString('de-DE', { month: 'long' });
  };

  const handlePrevMonth = () => {
    setVisibleMonthIndex((prevIndex) => {
      if (prevIndex === 0) {
        setVisibleYear((prevYear) => prevYear - 1);
        return 11; // December
      }
      return prevIndex - 1;
    });
  };

  const handleNextMonth = () => {
    setVisibleMonthIndex((prevIndex) => {
      if (prevIndex === 11) {
        setVisibleYear((prevYear) => prevYear + 1);
        return 0; // January
      }
      return prevIndex + 1;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>AbfallWise Deutschland</Text>
            <TouchableOpacity onPress={handleLocationRequest}>
              <Text style={styles.subtitle}>
                {userAddress.city}, {userAddress.postcode}
                {!hasPermission && ' (Tippen für Standort)'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleBellPress}>
            <Bell size={24} color="#228B22" />
          </TouchableOpacity>
        </View>

        {/* Quick Overview Cards */}
        <View style={styles.quickOverview}>
          <Text style={styles.sectionTitle}>Müllabfuhr Übersicht</Text>
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
          <Text style={styles.sectionTitle}>Nächste Abholungen</Text>
          {upcomingCollections.map((collection, index) => {
            const typeMap: { [key: string]: keyof typeof notifications } = {
              'Restmüll': 'restmuell',
              'Biomüll': 'biomuell',
              'Papier': 'papier',
              'Gelber Sack': 'gelberSack',
              'Altglas': 'altglas',
            };
            const notificationKey = typeMap[collection.type];
            const isNotificationActive = notificationKey ? notifications[notificationKey] : false;

            return (
              <TouchableOpacity key={index} style={styles.collectionItem}>
                <View style={[styles.colorIndicator, { backgroundColor: collection.color }]} />
                <View style={styles.collectionDetails}>
                  <Text style={styles.collectionType}>{collection.type}</Text>
                  <Text style={styles.collectionDate}>{collection.date}</Text>
                  <Text style={styles.collectionTime}>Abholung beginnt um {collection.time}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.reminderButton}
                  onPress={() => handleReminderPress(collection.type)}
                >
                  <Bell 
                    size={16} 
                    color={isNotificationActive ? '#228B22' : '#ccc'} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Full Year Calendar View */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Abfallkalender</Text>
          <Text style={styles.currentDateInfo}>Heute: {dayName}, {currentDay}. {getMonthName(currentMonth)}</Text>
          
          <View style={styles.monthContainer}>
            <View style={styles.calendarNavigation}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                <ChevronLeft size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>{getMonthName(visibleMonthIndex)} {visibleYear}</Text>
              <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                <ChevronRight size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.calendarGrid}>
              {Array.from({ length: new Date(visibleYear, visibleMonthIndex + 1, 0).getDate() }, (_, i) => i + 1).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={getCalendarDayStyle(day, visibleMonthIndex)}
                >
                  <Text style={getCalendarDayTextStyle(day, visibleMonthIndex)}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
    marginBottom: 15,
  },
  monthContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDay: {
    width: '13%', // Approx 7 days per row
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
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
