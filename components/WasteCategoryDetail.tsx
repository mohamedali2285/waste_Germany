import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { X, Trash2 } from 'lucide-react-native';

interface WasteCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  details: {
    belongs: string[];
    tips: string;
    forbidden: string[];
  };
}

interface WasteCategoryDetailProps {
  visible: boolean;
  category: WasteCategory | null;
  onClose: () => void;
}

export default function WasteCategoryDetail({ visible, category, onClose }: WasteCategoryDetailProps) {
  if (!category) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{category.name}</Text>
              <Text style={styles.description}>{category.description}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* What belongs here */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Was gehört hinein:</Text>
            {category.details.belongs.map((example, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>• {example}</Text>
              </View>
            ))}
          </View>

          {/* Tips */}
          {category.details.tips && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Tipps:</Text>
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>{category.details.tips}</Text>
              </View>
            </View>
          )}

          {/* What doesn't belong */}
          {category.details.forbidden && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>❌ Gehört NICHT hinein:</Text>
              {category.details.forbidden.map((item, index) => (
                <View key={index} style={styles.forbiddenItem}>
                  <Text style={styles.forbiddenText}>• {item}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  tipItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
  },
  tipText: {
    fontSize: 15,
    color: '#2d5a2d',
    lineHeight: 22,
  },
  forbiddenItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  forbiddenText: {
    fontSize: 16,
    color: '#721c24',
    lineHeight: 22,
  },
});
