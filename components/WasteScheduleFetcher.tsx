import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  StyleSheet, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { Search, MapPin, Calendar } from 'lucide-react-native';

interface LocationSchedule {
  city: string;
  district: string;
  street: string;
  year: number;
  schedule: { [key: string]: string }[];
}

const WasteScheduleFetcher = () => {
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('Heidenheim');
  const [district, setDistrict] = useState('Heidenheim');
  const [year, setYear] = useState('2025');

  const [scheduleData, setScheduleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWasteSchedule = async () => {
    if (!streetName.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال اسم الشارع.');
      return;
    }

    setLoading(true);
    setError(null);
    setScheduleData(null);

    try {
      // استخدام localhost للاختبار المحلي
      // للاختبار على جهاز حقيقي، استبدل localhost بعنوان IP الخاص بجهازك
      const backendUrl = 'http://localhost:3000/api/waste-schedule';

      const params = new URLSearchParams({
        street: encodeURIComponent(streetName),
        city: encodeURIComponent(city),
        district: encodeURIComponent(district),
        year: year,
      }).toString();

      const fullApiUrl = `${backendUrl}?${params}`;
      console.log('جاري الجلب من:', fullApiUrl);

      const response = await fetch(fullApiUrl);

      if (!response.ok) {
        const errorBody = await response.json();
        console.error(`خطأ HTTP! الحالة: ${response.status}, خطأ الخادم: ${errorBody.error}`);
        throw new Error(errorBody.error || `فشل جلب البيانات من الخادم. رمز الحالة: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error(`خطأ الخادم: ${data.error}`);
        throw new Error(data.error);
      }

      const formattedSchedule: LocationSchedule = {
        city: data.city,
        district: data.district,
        street: data.street,
        year: data.year,
        schedule: data.schedule,
      };

      setScheduleData(formattedSchedule.schedule);
      console.log('تم جلب البيانات بنجاح:', formattedSchedule.schedule);

    } catch (err: any) {
      setError(err.message);
      console.error('خطأ في جلب جدول النفايات:', err);
      Alert.alert('خطأ', 'حدث خطأ أثناء جلب البيانات: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Calendar size={32} color="#228B22" />
          <Text style={styles.title}>جلب جدول النفايات</Text>
          <Text style={styles.subtitle}>ابحث عن جدول جمع النفايات لشارعك</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Search size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="اسم الشارع (مثال: Steinheimer Straße)"
              value={streetName}
              onChangeText={setStreetName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.locationInfo}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>{city}, {district} - {year}</Text>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={fetchWasteSchedule}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Search size={20} color="#fff" />
            )}
            <Text style={styles.searchButtonText}>
              {loading ? "جاري البحث..." : "بحث عن جدول النفايات"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>خطأ: {error}</Text>
          </View>
        )}

        {/* Schedule Results */}
        {scheduleData && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleHeader}>
              جدول النفايات لـ {streetName}
            </Text>
            
            {scheduleData.map((monthData: any, index: number) => (
              <View key={index} style={styles.monthCard}>
                {Object.entries(monthData).map(([key, value]) => (
                  <View key={key} style={styles.scheduleRow}>
                    <Text style={styles.scheduleKey}>{key}:</Text>
                    <Text style={styles.scheduleValue}>{value as string}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>تعليمات الاستخدام:</Text>
          <Text style={styles.instructionsText}>
            • أدخل اسم الشارع بالألمانية{'\n'}
            • تأكد من تشغيل الخادم الخلفي على localhost:3000{'\n'}
            • للاختبار على جهاز حقيقي، استبدل localhost بعنوان IP الخاص بجهازك
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#228B22',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputSection: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#228B22',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
  },
  scheduleContainer: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 16,
    textAlign: 'center',
  },
  monthCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scheduleKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  scheduleValue: {
    fontSize: 14,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  instructionsContainer: {
    margin: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5a2d',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#2d5a2d',
    lineHeight: 20,
  },
});

export default WasteScheduleFetcher;