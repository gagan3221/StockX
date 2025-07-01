import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const mockGainers = [
  { id: '1', name: 'AAPL', price: '$150.25', change: '+2.5%', fullName: 'Apple Inc.' },
  { id: '2', name: 'GOOGL', price: '$2800.50', change: '+1.8%', fullName: 'Alphabet Inc.' },
  { id: '3', name: 'MSFT', price: '$310.75', change: '+3.2%', fullName: 'Microsoft Corp.' },
  { id: '4', name: 'AMZN', price: '$3400.75', change: '+0.9%', fullName: 'Amazon.com Inc.' },
  { id: '5', name: 'NVDA', price: '$420.50', change: '+4.1%', fullName: 'NVIDIA Corp.' },
  { id: '6', name: 'META', price: '$280.25', change: '+2.8%', fullName: 'Meta Platforms Inc.' },
];

const mockLosers = [
  { id: '1', name: 'TSLA', price: '$700.00', change: '-1.2%', fullName: 'Tesla Inc.' },
  { id: '2', name: 'NFLX', price: '$450.30', change: '-2.1%', fullName: 'Netflix Inc.' },
  { id: '3', name: 'UBER', price: '$45.80', change: '-1.8%', fullName: 'Uber Technologies Inc.' },
  { id: '4', name: 'SNAP', price: '$12.50', change: '-3.5%', fullName: 'Snap Inc.' },
  { id: '5', name: 'TWTR', price: '$35.20', change: '-2.7%', fullName: 'Twitter Inc.' },
  { id: '6', name: 'PYPL', price: '$85.40', change: '-1.9%', fullName: 'PayPal Holdings Inc.' },
];

const mockActive = [
  { id: '1', name: 'SPY', price: '$420.15', change: '+0.5%', fullName: 'SPDR S&P 500 ETF' },
  { id: '2', name: 'QQQ', price: '$350.80', change: '+1.2%', fullName: 'Invesco QQQ Trust' },
  { id: '3', name: 'IWM', price: '$200.45', change: '-0.8%', fullName: 'iShares Russell 2000 ETF' },
  { id: '4', name: 'VTI', price: '$220.30', change: '+0.3%', fullName: 'Vanguard Total Stock Market ETF' },
];

function StockListItem({ item, onPress }: { item: any; onPress: () => void }) {
  const isPositive = item.change.startsWith('+');
  
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.stockInfo}>
        <View style={styles.avatar} />
        <View style={styles.stockDetails}>
          <Text style={styles.stockName}>{item.name}</Text>
          <Text style={styles.fullName}>{item.fullName}</Text>
        </View>
      </View>
      <View style={styles.priceInfo}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={[styles.change, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
          {item.change}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TopGainersLosersScreen({ route, navigation }: any) {
  const { type } = route.params || { type: 'gainers' };
  
  let data, title;
  switch (type) {
    case 'gainers':
      data = mockGainers;
      title = 'Top Gainers';
      break;
    case 'losers':
      data = mockLosers;
      title = 'Top Losers';
      break;
    case 'active':
      data = mockActive;
      title = 'Most Active';
      break;
    default:
      data = mockGainers;
      title = 'Top Gainers';
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <StockListItem 
            item={item} 
            onPress={() => navigation.navigate('StockDetails', { stock: item })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444',
    marginRight: 12,
  },
  stockDetails: {
    flex: 1,
  },
  stockName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  fullName: {
    color: '#aaa',
    fontSize: 12,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 