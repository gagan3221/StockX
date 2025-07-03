import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { alphaVantageAPI, Stock } from '../../services/AlphaVantageAPI';
import { mockTopGainers, mockTopLosers, mockMostActive } from '../../services/mockData';
import { ThemeContext } from '../theme/ThemeContext';

function StockListItem({ item, onPress, type, theme }: { item: Stock; onPress: () => void; type: string; theme: string }) {
  const isDark = theme === 'dark';
  const isPositive = item.changePercent.startsWith('+');
  let changeColor = '#F44336';
  let avatarIcon = null;
  if (type === 'gainers') {
    changeColor = '#4CAF50';
    avatarIcon = <Icon name="arrow-up" size={20} color={changeColor} />;
  } else if (type === 'losers') {
    changeColor = isPositive ? '#4CAF50' : '#F44336';
    avatarIcon = <Icon name="arrow-down" size={20} color={changeColor} />;
  } else {
    changeColor = isPositive ? '#4CAF50' : '#F44336';
  }
  return (
    <TouchableOpacity style={[styles.listItem, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]} onPress={onPress}>
      <View style={styles.stockInfo}>
        <View style={[styles.avatar, { backgroundColor: isDark ? '#444' : '#e0e0e0', justifyContent: 'center', alignItems: 'center' }] }>
          {avatarIcon}
        </View>
        <View style={styles.stockDetails}>
          <Text style={[styles.stockName, { color: isDark ? '#fff' : '#111' }]}>{item.symbol}</Text>
          <Text style={[styles.fullName, { color: isDark ? '#aaa' : '#333' }]}>{item.name}</Text>
        </View>
      </View>
      <View style={styles.priceInfo}>
        <Text style={[styles.price, { color: isDark ? '#fff' : '#111' }]}>{item.price}</Text>
        <Text style={[styles.change, { color: changeColor }]}>
          {item.changePercent}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TopGainersLosersScreen({ route, navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const { type, data: initialData } = route.params || { type: 'gainers', data: null };
  
  const [stocks, setStocks] = useState<Stock[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  
  const getTitle = () => {
    switch (type) {
      case 'gainers':
        return 'Top Gainers';
      case 'losers':
        return 'Top Losers';
      case 'active':
        return 'Most Active';
      default:
        return 'Top Gainers';
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchStockData();
    }
  }, []);

  const fetchStockData = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching ${type} data... ${forceRefresh ? '(force refresh)' : '(using cache if available)'}`);
      
      let data: Stock[];
      switch (type) {
        case 'gainers':
          data = forceRefresh ? await alphaVantageAPI.refreshTopGainers() : await alphaVantageAPI.getTopGainers();
          break;
        case 'losers':
          data = forceRefresh ? await alphaVantageAPI.refreshTopLosers() : await alphaVantageAPI.getTopLosers();
          break;
        case 'active':
          data = forceRefresh ? await alphaVantageAPI.refreshMostActive() : await alphaVantageAPI.getMostActive();
          break;
        default:
          data = forceRefresh ? await alphaVantageAPI.refreshTopGainers() : await alphaVantageAPI.getTopGainers();
      }
      
      setStocks(data);
      console.log(`✅ ${type} data loaded successfully ${forceRefresh ? '(fresh from API)' : '(from cache or API)'}`);
    } catch (err: any) {
      console.error('Error fetching stock data:', err);
      
      // If it's a rate limit error, show mock data
      if (err.message && err.message.includes('Daily API limit reached')) {
        let mockData: Stock[];
        switch (type) {
          case 'gainers':
            mockData = mockTopGainers;
            break;
          case 'losers':
            mockData = mockTopLosers;
            break;
          case 'active':
            mockData = mockMostActive;
            break;
          default:
            mockData = mockTopGainers;
        }
        setStocks(mockData);
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={48} color="#F44336" />
          <Text style={styles.errorTitle}>Unable to Load Data</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }] }>
      <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#ccc', backgroundColor: isDark ? '#000' : '#fff' }] }>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#fff' : '#111'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#111' }]}>{getTitle()}</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color={isDark ? '#fff' : '#111'} />
        </TouchableOpacity>
      </View>
      
      {loading && stocks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={[styles.loadingText, { color: isDark ? '#aaa' : '#333' }]}>Loading stocks...</Text>
        </View>
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <StockListItem 
              item={item} 
              onPress={() => navigation.navigate('StockDetails', { stock: item })}
              type={type}
              theme={theme}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
        />
      )}
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
    marginTop: 40
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
  refreshButton: {
    padding: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
}); 