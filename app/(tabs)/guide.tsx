import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Search, ChevronRight } from 'lucide-react-native';
import { WasteCategoryDetail } from '@/components/WasteCategoryDetail';

const wasteCategories = [
  {
    id: 'restmuell',
    name: 'Restmüll',
    color: '#666666',
    icon: '🗑️',
    description: 'Nicht recycelbare Abfälle',
    details: {
      belongs: ['Windeln', 'Zigarettenstummel', 'Katzenstreu', 'Staubsaugerbeutel', 'Kondome'],
      tips: 'Restmüll sollte in grauen Tonnen entsorgt werden.',
      forbidden: ['Batterien', 'Elektronik', 'Glas', 'Papier']
    }
  },
  {
    id: 'biomuell',
    name: 'Biomüll',
    color: '#4CAF50',
    icon: '🍃',
    description: 'Organische Abfälle',
    details: {
      belongs: ['Obst- und Gemüsereste', 'Kaffeesatz', 'Eierschalen', 'Gartenabfälle', 'Teebeutel'],
      tips: 'Biomüll wird zu Kompost verarbeitet.',
      forbidden: ['Fleisch', 'Fisch', 'Milchprodukte', 'Katzenstreu']
    }
  },
  {
    id: 'papier',
    name: 'Papier',
    color: '#2196F3',
    icon: '📄',
    description: 'Papier und Karton',
    details: {
      belongs: ['Zeitungen', 'Kartons', 'Bücher', 'Briefumschläge', 'Pappe'],
      tips: 'Papier sollte sauber und trocken sein.',
      forbidden: ['Beschichtetes Papier', 'Fotos', 'Tapeten', 'Windeln']
    }
  },
  {
    id: 'gelber-sack',
    name: 'Gelber Sack',
    color: '#FFC107',
    icon: '♻️',
    description: 'Verpackungen',
    details: {
      belongs: ['Plastikverpackungen', 'Konservendosen', 'Getränkekartons', 'Styropor', 'Alufolie'],
      tips: 'Verpackungen müssen löffelrein sein.',
      forbidden: ['Spielzeug', 'Elektrogeräte', 'CDs', 'Windeln']
    }
  },
  {
    id: 'altglas',
    name: 'Altglas',
    color: '#009688',
    icon: '🍾',
    description: 'Glasverpackungen',
    details: {
      belongs: ['Glasflaschen', 'Konservengläser', 'Marmeladengläser', 'Parfümflaschen'],
      tips: 'Nach Farben sortieren: Weiß, Braun, Grün.',
      forbidden: ['Fensterglas', 'Spiegel', 'Glühbirnen', 'Keramik']
    }
  },
  {
    id: 'sondermuell',
    name: 'Sondermüll',
    color: '#F44336',
    icon: '⚠️',
    description: 'Gefährliche Abfälle',
    details: {
      belongs: ['Batterien', 'Farben', 'Chemikalien', 'Medikamente', 'Energiesparlampen'],
      tips: 'Zum Wertstoffhof oder Schadstoffmobil bringen.',
      forbidden: ['Restmüll', 'Gelber Sack', 'Biomüll']
    }
  }
];

export default function Guide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const filteredCategories = wasteCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Abfall-Ratgeber</Text>
        <Text style={styles.subtitle}>Richtige Mülltrennung leicht gemacht</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Abfallart suchen..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Abfallkategorien</Text>
        
        {filteredCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { borderLeftColor: category.color }]}
            onPress={() => setSelectedCategory(category)}
          >
            <View style={styles.categoryContent}>
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.tipSection}>
          <Text style={styles.tipTitle}>💡 Tipp des Tages</Text>
          <Text style={styles.tipText}>
            Spülen Sie Verpackungen nur löffelrein aus - das spart Wasser und Energie!
          </Text>
        </View>
      </ScrollView>

      {selectedCategory && (
        <WasteCategoryDetail
          category={selectedCategory}
          visible={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#228B22',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
  },
  tipSection: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});