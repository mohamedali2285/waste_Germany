import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WasteTypeCardProps {
  name: string;
  color: string;
  nextDate: string;
  onPress?: () => void;
}

export default function WasteTypeCard({ name, color, nextDate, onPress }: WasteTypeCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.date}>{nextDate}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});