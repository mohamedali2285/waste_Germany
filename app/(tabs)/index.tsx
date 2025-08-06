import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Bell, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useWasteSchedule } from '@/hooks/useWasteSchedule';
import { storage } from '@/utils/storage';

export default function CalendarScreen() {
  const { currentDate, currentDay, currentMonth, currentYear, dayName } = useCurrentDate();
  const { 
    wasteTypes, 
    upcomingCollections, 
    yearCalendarData, 
    notifications, 
    setNotifications,
    userAddress,
    updateAddressAndSchedule,
    testServerConnection 
  } = useWasteSchedule();

  const [visibleMonthIndex, setVisibleMonthIndex] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Effect to reset visibleMonthIndex when userAddress.postcode changes
  useEffect(() => {
    setVisibleMonthIndex(currentMonth);
  }, [userAddress.postcode, currentMonth]);

  const handleBellPress = async () => {
    // Navigate to profile or show notification settings
    console.log('Bell pressed - navigate to profile');
  };

  const handleReminderPress = async (wasteType: string) => {
    const typeMap: { [key: string]: keyof typeof notifications } = {
      'Restmüll': 'restmuell',
      'Biomüll': 'biomuell',
      'Papiertonne': 'papiertonne',
      'Altpapier': 'altpapier',
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
    }
  };

  const handleDayPress = (day: number, monthIndex: number) => {
    if (selectedDay === day && selectedMonth === monthIndex) {
      // Deselect if same day is pressed
      setSelectedDay(null);
      setSelectedMonth(null);
    } else {
      setSelectedDay(day);
      setSelectedMonth(monthIndex);
    }
  };

  const getMonthName = (monthIndex: number) => {
    const date = new Date(currentYear, monthIndex, 1);
    return date.toLocaleDateString('de-DE', { month: 'long' });
  };

  const handlePreviousMonth = () => {
    setVisibleMonthIndex((prevIndex) => (prevIndex === 0 ? 11 : prevIndex - 1));
  };

  const handleNextMonth = () => {
    setVisibleMonthIndex((prevIndex) => (prevIndex === 11 ? 0 : prevIndex + 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>AbfallWise Deutschland</Text>
            <Text style={styles.subtitle}>
              {userAddress.city}, {userAddress.postcode}
            </Text>
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
              'Papiertonne': 'papiertonne',
              'Altpapier': 'altpapier',
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
          <Text style={styles.sectionTitle}>Abfallkalender {currentYear}</Text>
          <Text style={styles.currentDateInfo}>Heute: {dayName}, {currentDay}. {getMonthName(currentMonth)}</Text>
          
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
              <ChevronLeft size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{getMonthName(visibleMonthIndex)}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <ChevronRight size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.monthContainer}>
            <View style={styles.calendarGrid}>
              {Array.from({ length: new Date(currentYear, visibleMonthIndex + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                const wasteInfo = yearCalendarData[visibleMonthIndex]?.[day];
                const isCurrentDay = day === currentDay && visibleMonthIndex === currentMonth && currentYear === new Date().getFullYear();
                const isSelected = selectedDay === day && selectedMonth === visibleMonthIndex;

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.calendarDay,
                      isCurrentDay && styles.currentDay,
                      isSelected && styles.selectedDay,
                    ]}
                    onPress={() => handleDayPress(day, visibleMonthIndex)}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      isCurrentDay && styles.currentDayText,
                      isSelected && styles.selectedDayText,
                    ]}>
                      {day}
                    </Text>
                    {wasteInfo && wasteInfo.length > 0 && (
                      <View style={styles.collectionDotsContainer}>
                        {wasteInfo.map((info, idx) => (
                          <View
                            key={idx}
                            style={[styles.collectionDot, { backgroundColor: info.color }]}
                          />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Day Info */}
          {selectedDay && selectedMonth !== null && (
            <View style={styles.selectedDayInfo}>
              <View style={styles.selectedDayHeader}>
                <Calendar size={20} color="#228B22" />
                <Text style={styles.selectedDayTitle}>
                  {selectedDay}. {getMonthName(selectedMonth)} {currentYear}
                </Text>
              </View>
              {yearCalendarData[selectedMonth]?.[selectedDay] ? (
                <View style={styles.wasteInfoContainer}>
                  <Text style={styles.wasteInfoTitle}>Müllabholung an diesem Tag:</Text>
                  {yearCalendarData[selectedMonth][selectedDay].map((waste, index) => (
                    <View key={index} style={styles.wasteInfoItem}>
                      <View style={[styles.wasteInfoDot, { backgroundColor: waste.color }]} />
                      <Text style={styles.wasteInfoText}>{waste.type}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noWasteText}>Keine Müllabholung an diesem Tag</Text>
              )}
            </View>
          )}
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
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    padding: 10,
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
    paddingVertical: 5, // Add padding to make space for dots
  },
  currentDay: {
    backgroundColor: '#228B22',
  },
  selectedDay: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#228B22',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#333',
  },
  currentDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  collectionDotsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  collectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
    marginBottom: 2,
  },
  selectedDayInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  wasteInfoContainer: {
    marginTop: 8,
  },
  wasteInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  wasteInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  wasteInfoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  wasteInfoText: {
    fontSize: 14,
    color: '#333',
  },
  noWasteText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});
