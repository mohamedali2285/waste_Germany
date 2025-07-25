import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Check, X } from 'lucide-react-native';

const timeOptions = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

interface TimeSelectorProps {
  visible: boolean;
  currentTime: string;
  onClose: () => void;
  onSelect: (time: string) => void;
}

export default function TimeSelector({ 
  visible, 
  currentTime, 
  onClose, 
  onSelect 
}: TimeSelectorProps) {
  const handleSelect = (time: string) => {
    onSelect(time);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Notification Time</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.timeList}>
          <Text style={styles.description}>
            Choose when you want to receive collection reminders
          </Text>
          {timeOptions.map((time) => (
            <TouchableOpacity
              key={time}
              style={styles.timeItem}
              onPress={() => handleSelect(time)}
            >
              <Text style={styles.timeText}>{time}</Text>
              {currentTime === time && (
                <Check size={20} color="#228B22" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  timeList: {
    flex: 1,
    paddingTop: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});