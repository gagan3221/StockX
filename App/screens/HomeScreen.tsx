import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { alphaVantageAPI, Stock } from '../../services/AlphaVantageAPI';
import { mockTopGainers, mockTopLosers, mockMostActive } from '../../services/mockData';

function StockCard({ name, price, change, fullName, onPress, type }: { name: string; price: string; change: string; fullName: string; onPress: () => void; type?: string }) {
  const isPositive = change.startsWith('+');
  let changeColor = '#F44336';
  if (type === 'gainers' || type === 'active') {
    changeColor = '#4CAF50';
  } else {
    changeColor = isPositive ? '#4CAF50' : '#F44336';
  }
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatar} />
      <Text style={styles.stockName}>{name}</Text>
      <Text style={styles.stockPrice}>{price}</Text>
      <Text style={[styles.stockChange, { color: changeColor }]}> 
        {change}
      </Text>
    </TouchableOpacity>
  );
}

function Section({ title, onViewAll, data, navigation, loading }: { title: string; onViewAll: () => void; data: Stock[]; navigation: any; loading: boolean }) {
  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading stocks...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data.slice(0, 4)} // Show only first 4 items on home screen
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <StockCard 
            name={item.symbol} 
            price={item.price} 
            change={item.changePercent} 
            fullName={item.name}
            onPress={() => navigation.navigate('StockDetails', { stock: item })}
            type={title === 'Top Gainers' ? 'gainers' : title === 'Most Active' ? 'active' : undefined}
          />
        )}
        columnWrapperStyle={styles.cardRow}
        scrollEnabled={false}
      />
    </View>
  );
}

export default function HomeScreen({ navigation }: any) {
  const [topGainers, setTopGainers] = useState<Stock[]>([]);
  const [topLosers, setTopLosers] = useState<Stock[]>([]);
  const [mostActive, setMostActive] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching stock data... ${forceRefresh ? '(force refresh)' : '(using cache if available)'}`);
      
      // Fetch all data in parallel
      const [gainersData, losersData, activeData] = await Promise.all([
        forceRefresh ? alphaVantageAPI.refreshTopGainers() : alphaVantageAPI.getTopGainers(),
        forceRefresh ? alphaVantageAPI.refreshTopLosers() : alphaVantageAPI.getTopLosers(),
        forceRefresh ? alphaVantageAPI.refreshMostActive() : alphaVantageAPI.getMostActive(),
      ]);

      setTopGainers(gainersData);
      setTopLosers(losersData);
      setMostActive(activeData);
      
      console.log(`✅ Stock data loaded successfully ${forceRefresh ? '(fresh from API)' : '(from cache or API)'}`);
      
      // Log cache info for debugging
      const cacheInfo = await alphaVantageAPI.getCacheInfo();
      console.log('Cache status:', cacheInfo);
    } catch (err: any) {
      console.error('Error fetching stock data:', err);
      
      // If it's a rate limit error, show mock data
      if (err.message && err.message.includes('Daily API limit reached')) {
        setTopGainers(mockTopGainers);
        setTopLosers(mockTopLosers);
        setMostActive(mockMostActive);
        setError('API limit reached - showing sample data. Try again tomorrow for live data.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStockData(true); // Force refresh on pull-to-refresh
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={48} color="#F44336" />
          <Text style={styles.errorTitle}>Unable to Load Data</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={24} color="#fff" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Watchlist')}>
            <Icon name="star-outline" size={24} color="#aaa" />
            <Text style={[styles.navText, { color: '#aaa' }]}>Watchlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      >
        <Section
          title="Top Gainers"
          onViewAll={() => navigation.navigate('TopGainersLosers', { type: 'gainers', data: topGainers })}
          data={topGainers}
          navigation={navigation}
          loading={loading}
        />
        <Section
          title="Top Losers"
          onViewAll={() => navigation.navigate('TopGainersLosers', { type: 'losers', data: topLosers })}
          data={topLosers}
          navigation={navigation}
          loading={loading}
        />
        <Section
          title="Most Active"
          onViewAll={() => navigation.navigate('TopGainersLosers', { type: 'active', data: mostActive })}
          data={mostActive}
          navigation={navigation}
          loading={loading}
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
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings-outline" size={24} color="#aaa" />
          <Text style={[styles.navText, { color: '#aaa' }]}>Settings</Text>
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#aaa',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
