import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { MapPin, Clock, ChevronRight, Globe, Settings, CircleHelp as HelpCircle, CreditCard as Edit3, Save, Locate } from 'lucide-react-native';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useWasteSchedule } from '@/hooks/useWasteSchedule';
import { useLocation } from '@/hooks/useLocation';
import { storage } from '@/utils/storage';
import { getScheduleByPostcode } from '@/utils/garbageSchedules';
import LanguageSelector from '@/components/LanguageSelector';
import TimeSelector from '@/components/TimeSelector';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('de');
  const [notificationTime, setNotificationTime] = useState('18:00');
  
  const { currentDate } = useCurrentDate();
  const { 
    notifications, 
    setNotifications, 
    userAddress, 
    updateAddressAndSchedule,
    currentSchedule 
  } = useWasteSchedule();
  const { location, requestLocation, hasPermission } = useLocation();
  
  const [tempAddress, setTempAddress] = useState(userAddress);

  useEffect(() => {
    setTempAddress(userAddress);
  }, [userAddress]);

  const handleSaveAddress = async () => {
    await updateAddressAndSchedule(tempAddress);
    setIsEditing(false);
    
    // Check if we have a schedule for this postcode
    const schedule = getScheduleByPostcode(tempAddress.postcode);
    if (schedule) {
      Alert.alert(
        'Adresse gespeichert',
        `Abfallplan für ${schedule.city} wurde geladen.`
      );
    } else {
      Alert.alert(
        'Adresse gespeichert',
        'Standard-Abfallplan wird verwendet, da für diese Postleitzahl kein spezifischer Plan verfügbar ist.'
      );
    }
  };

  const handleCancelEdit = () => {
    setTempAddress(userAddress);
    setIsEditing(false);
  };

  const handleUseCurrentLocation = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Location Permission',
        'Allow location access to automatically fill your address.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Allow', onPress: requestLocation },
        ]
      );
    } else {
      await requestLocation();
      if (location?.address) {
        // Parse the address (this is a simplified parser)
        const parts = location.address.split(',');
        if (parts.length >= 2) {
          const streetPart = parts[0].trim();
          const cityPart = parts[1].trim();
          
          setTempAddress({
            street: streetPart.replace(/\d+$/, '').trim(),
            houseNumber: streetPart.match(/\d+$/) ? streetPart.match(/\d+$/)![0] : '',
            postcode: cityPart.match(/^\d{5}/) ? cityPart.match(/^\d{5}/)![0] : '',
            city: cityPart.replace(/^\d{5}\s*/, ''),
          });
        }
      }
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    setCurrentLanguage(languageCode);
    await storage.saveSettings({ language: languageCode });
    setShowLanguageSelector(false);
    Alert.alert(
      'Language Changed', 
      `Language set to ${getLanguageName(languageCode)}. App will use this language for future updates.`,
      [{ text: 'OK' }]
    );
  };

  const handleTimeChange = async (time: string) => {
    setNotificationTime(time);
    await storage.saveSettings({ notificationTime: time });
    setShowTimeSelector(false);
    Alert.alert(
      'Time Updated', 
      `Notification time set to ${time}. You'll receive reminders at this time.`,
      [{ text: 'OK' }]
    );
  };

  const handleNotificationChange = async (type: string, value: boolean) => {
    const newNotifications = { ...notifications, [type]: value };
    setNotifications(newNotifications);
    await storage.saveNotifications(newNotifications);
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      'de': 'Deutsch',
      'en': 'English',
      'tr': 'Türkçe',
      'ar': 'العربية',
      'fr': 'Français',
      'es': 'Español',
    };
    return languages[code] || 'Deutsch';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil & Einstellungen</Text>
        <Text style={styles.subtitle}>Passen Sie Ihre Abfallmanagement-Einstellungen an</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ihre Adresse</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
            >
              {isEditing ? (
                <Text style={styles.editButtonText}>Cancel</Text>
              ) : (
                <>
                  <Edit3 size={16} color="#228B22" />
                  <Text style={styles.editButtonText}>Bearbeiten</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.addressCard}>
            <MapPin size={20} color="#228B22" />
            <View style={styles.addressContent}>
              {isEditing ? (
                <>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.streetInput]}
                      value={tempAddress.street}
                      onChangeText={(text) => setTempAddress({...tempAddress, street: text})}
                      placeholder="Straßenname"
                    />
                    <TextInput
                      style={[styles.input, styles.houseInput]}
                      value={tempAddress.houseNumber}
                      onChangeText={(text) => setTempAddress({...tempAddress, houseNumber: text})}
                      placeholder="Nr."
                    />
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.postcodeInput]}
                      value={tempAddress.postcode}
                      onChangeText={(text) => setTempAddress({...tempAddress, postcode: text})}
                      placeholder="Postleitzahl"
                    />
                    <TextInput
                      style={[styles.input, styles.cityInput]}
                      value={tempAddress.city}
                      onChangeText={(text) => setTempAddress({...tempAddress, city: text})}
                      placeholder="Stadt"
                    />
                  </View>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                    <Save size={16} color="#fff" />
                    <Text style={styles.saveButtonText}>Adresse speichern</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
                    <Locate size={16} color="#228B22" />
                    <Text style={styles.locationButtonText}>Aktuellen Standort verwenden</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.addressText}>
                    {userAddress.street} {userAddress.houseNumber}
                  </Text>
                  <Text style={styles.addressSubtext}>
                    {userAddress.postcode} {userAddress.city}
                  </Text>
                  <Text style={styles.scheduleInfo}>
                    Abfallplan: {currentSchedule.city}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abholungs-Erinnerungen</Text>
          <Text style={styles.sectionDescription}>
            Lassen Sie sich vor Abholtagen benachrichtigen
          </Text>

          <View style={styles.notificationsList}>
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={[styles.wasteColorDot, { backgroundColor: '#2F4F4F' }]} />
                <Text style={styles.notificationName}>Restmüll</Text>
              </View>
              <Switch
                value={notifications.restmuell}
                onValueChange={(value) => handleNotificationChange('restmuell', value)}
                trackColor={{ false: '#ddd', true: '#228B22' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={[styles.wasteColorDot, { backgroundColor: '#8FBC8F' }]} />
                <Text style={styles.notificationName}>Biomüll</Text>
              </View>
              <Switch
                value={notifications.biomuell}
                onValueChange={(value) => handleNotificationChange('biomuell', value)}
                trackColor={{ false: '#ddd', true: '#228B22' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={[styles.wasteColorDot, { backgroundColor: '#4169E1' }]} />
                <Text style={styles.notificationName}>Papier</Text>
              </View>
              <Switch
                value={notifications.papier}
                onValueChange={(value) => handleNotificationChange('papier', value)}
                trackColor={{ false: '#ddd', true: '#228B22' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={[styles.wasteColorDot, { backgroundColor: '#FFD700' }]} />
                <Text style={styles.notificationName}>Gelber Sack</Text>
              </View>
              <Switch
                value={notifications.gelberSack}
                onValueChange={(value) => handleNotificationChange('gelberSack', value)}
                trackColor={{ false: '#ddd', true: '#228B22' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={[styles.wasteColorDot, { backgroundColor: '#90EE90' }]} />
                <Text style={styles.notificationName}>Altglas</Text>
              </View>
              <Switch
                value={notifications.altglas}
                onValueChange={(value) => handleNotificationChange('altglas', value)}
                trackColor={{ false: '#ddd', true: '#228B22' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Globe size={20} color="#666" />
            <Text style={styles.settingText}>Sprache</Text>
            <Text style={styles.settingValue}>{getLanguageName(currentLanguage)}</Text>
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowTimeSelector(true)}
          >
            <Clock size={20} color="#666" />
            <Text style={styles.settingText}>Benachrichtigungszeit</Text>
            <Text style={styles.settingValue}>{notificationTime}</Text>
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Settings size={20} color="#666" />
            <Text style={styles.settingText}>App-Einstellungen</Text>
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <HelpCircle size={20} color="#666" />
            <Text style={styles.settingText}>Hilfe & Support</Text>
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.appInfo}>AbfallWise Deutschland v1.0.0</Text>
          <Text style={styles.appDescription}>
            Hilft dabei, die Abfallwirtschaft in Heidenheim an der Brenz und ganz Deutschland für alle einfacher zu machen.
          </Text>
        </View>
      </ScrollView>

      <LanguageSelector
        visible={showLanguageSelector}
        currentLanguage={currentLanguage}
        onClose={() => setShowLanguageSelector(false)}
        onSelect={handleLanguageChange}
      />

      <TimeSelector
        visible={showTimeSelector}
        currentTime={notificationTime}
        onClose={() => setShowTimeSelector(false)}
        onSelect={handleTimeChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f0f8f0',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#228B22',
    marginLeft: 4,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  addressContent: {
    flex: 1,
    marginLeft: 12,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  addressSubtext: {
    fontSize: 14,
    color: '#666',
  },
  scheduleInfo: {
    fontSize: 12,
    color: '#228B22',
    marginTop: 4,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  streetInput: {
    flex: 2,
    marginRight: 8,
  },
  houseInput: {
    flex: 1,
  },
  postcodeInput: {
    flex: 1,
    marginRight: 8,
  },
  cityInput: {
    flex: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#228B22',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#228B22',
    marginLeft: 8,
  },
  notificationsList: {
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wasteColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  notificationName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  appInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
