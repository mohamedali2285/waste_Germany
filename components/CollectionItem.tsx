import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';

interface CollectionItemProps {
  type: string;
  date: string;
  time: string;
  color: string;
  onReminderPress?: () => void;
}

export default function CollectionItem({ type, date, time, color, onReminderPress }: CollectionItemProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>Collection starts at {time}</Text>
      </View>
      <TouchableOpacity style={styles.reminderButton} onPress={onReminderPress}>
        <Bell size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  content: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  reminderButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
});