import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { alphaVantageAPI, SearchResult } from '../../services/AlphaVantageAPI';
import { useWatchlist } from '../components/WatchlistContext';

interface SearchResultItemProps {
  item: SearchResult;
  onAdd: () => void;
}

function SearchResultItem({ item, onAdd }: SearchResultItemProps) {
  return (
    <View style={styles.resultItem}>
      <View style={styles.resultInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item['1. symbol'] === 'AAPL' ? '🍎' : 
             item['1. symbol'] === 'GOOGL' ? '🔍' : 
             item['1. symbol'] === 'TSLA' ? '🚗' : 
             item['1. symbol'] === 'AMZN' ? '📦' : '📈'}
          </Text>
        </View>
        <View style={styles.resultDetails}>
          <Text style={styles.resultSymbol}>{item['1. symbol']}</Text>
          <Text style={styles.resultName}>{item['2. name']}</Text>
          <Text style={styles.resultType}>{item['3. type']} • {item['4. region']}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Icon name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addToWatchlist, isInWatchlist } = useWatchlist();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`Searching for "${query.trim()}"... (using cache if available)`);
      
      const results = await alphaVantageAPI.searchSymbol(query.trim());
      setSearchResults(results);
      
      console.log(`✅ Search completed for "${query.trim()}" - found ${results.length} results`);
    } catch (err) {
      console.error('Error searching stocks:', err);
      setError(err instanceof Error ? err.message : 'Failed to search stocks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (searchResult: SearchResult) => {
    const symbol = searchResult['1. symbol'];
    
    if (isInWatchlist(symbol)) {
      Alert.alert('Already in Watchlist', `${symbol} is already in your watchlist.`);
      return;
    }

    try {
      // Create a basic stock object for the watchlist
      const stock = {
        id: symbol,
        symbol: symbol,
        name: searchResult['2. name'],
        price: '$0.00', // Will be updated when user views details
        change: '0',
        changePercent: '0%',
        volume: '0',
      };

      addToWatchlist(stock);
      Alert.alert('Added to Watchlist', `${symbol} has been added to your watchlist.`);
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      Alert.alert('Error', 'Failed to add stock to watchlist.');
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <SearchResultItem 
      item={item} 
      onAdd={() => handleAddToWatchlist(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Stocks</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for stocks (e.g., AAPL, Apple, Tesla)"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoCapitalize="characters"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={() => handleSearch(searchQuery)}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Searching stocks...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="warning-outline" size={48} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => handleSearch(searchQuery)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : searchResults.length > 0 ? (
          <>
            <Text style={styles.resultsHeader}>
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </Text>
            <FlatList
              data={searchResults}
              keyExtractor={item => item['1. symbol']}
              renderItem={renderSearchResult}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        ) : searchQuery.length > 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Icon name="search-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>Try searching with a different term</Text>
          </View>
        ) : (
          <View style={styles.instructionsContainer}>
            <Icon name="search-outline" size={64} color="#666" />
            <Text style={styles.instructionsText}>Search for Stocks</Text>
            <Text style={styles.instructionsSubtext}>
              Enter a stock symbol (AAPL) or company name (Apple) to find and add stocks to your watchlist
            </Text>
          </View>
        )}
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsHeader: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  resultInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  resultDetails: {
    flex: 1,
  },
  resultSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultName: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  resultType: {
    color: '#666',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: '#F44336',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  instructionsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  instructionsSubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 