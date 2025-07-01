import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const mockStocks = [
  { id: '1', name: 'AAPL', price: '$150.25', change: '+2.5%' },
  { id: '2', name: 'GOOGL', price: '$2800.50', change: '+1.8%' },
  { id: '3', name: 'TSLA', price: '$700.00', change: '-1.2%' },
  { id: '4', name: 'AMZN', price: '$3400.75', change: '+0.9%' },
];

function StockCard({ name, price, change }: { name: string; price: string; change: string }) {
  const isPositive = change.startsWith('+');
  
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.avatar} />
      <Text style={styles.stockName}>{name}</Text>
      <Text style={styles.stockPrice}>{price}</Text>
      <Text style={[styles.stockChange, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
        {change}
      </Text>
    </TouchableOpacity>
  );
}

function Section({ title, onViewAll, data }: { title: string; onViewAll: () => void; data: any[] }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StockCard name={item.name} price={item.price} change={item.change} />}
        columnWrapperStyle={styles.cardRow}
        scrollEnabled={false}
      />
    </View>
  );
}

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Section
          title="Top Gainers"
          onViewAll={() => navigation.navigate('TopGainersLosers', { type: 'gainers' })}
          data={mockStocks}
        />
        <Section
          title="Top Losers"
          onViewAll={() => navigation.navigate('TopGainersLosers', { type: 'losers' })}
          data={mockStocks}
        />
        <Section
          title="Most Active"
          onViewAll={() => navigation.navigate('TopGainersLosers', { type: 'active' })}
          data={mockStocks}
        />
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Watchlist')}>
          <Icon name="star-outline" size={24} color="#aaa" />
          <Text style={[styles.navText, { color: '#aaa' }]}>Watchlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StockDetails')}>
          <Icon name="trending-up" size={24} color="#aaa" />
          <Text style={[styles.navText, { color: '#aaa' }]}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#aaa',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: 140,
    maxWidth: '48%',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#444',
    marginBottom: 8,
  },
  stockName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  stockPrice: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  stockChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
