import React, { forwardRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWatchlist } from './WatchlistContext';

interface WatchlistBottomSheetProps {
  onStockPress: (stock: any) => void;
}

const WatchlistBottomSheet = forwardRef<BottomSheet, WatchlistBottomSheetProps>(
  ({ onStockPress }, ref) => {
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    console.log('WatchlistBottomSheet rendering with watchlist:', watchlist);
    console.log('Watchlist length:', watchlist.length);

    const renderStockItem = ({ item }: { item: any }) => {
      const isPositive = item.change.startsWith('+');
      
      return (
        <TouchableOpacity 
          style={styles.stockItem} 
          onPress={() => onStockPress(item)}
        >
          <View style={styles.stockInfo}>
            <View style={styles.avatar} />
            <View style={styles.stockDetails}>
              <Text style={styles.stockName}>{item.name}</Text>
              <Text style={styles.fullName}>{item.fullName}</Text>
            </View>
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={[styles.change, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
              {item.change}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromWatchlist(item.id)}
          >
            <Icon name="close" size={20} color="#aaa" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        onChange={(index) => console.log('BottomSheet state changed to index:', index)}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Watchlist</Text>
            <Text style={styles.count}>{watchlist.length} stocks</Text>
          </View>
          
          {watchlist.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="star-outline" size={48} color="#666" />
              <Text style={styles.emptyText}>No stocks in watchlist</Text>
              <Text style={styles.emptySubtext}>Add stocks to track them here</Text>
            </View>
          ) : (
            <FlatList
              data={watchlist}
              keyExtractor={item => item.id}
              renderItem={renderStockItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#1a1a1a',
  },
  handleIndicator: {
    backgroundColor: '#666',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  count: {
    color: '#aaa',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  listContainer: {
    paddingTop: 8,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  priceSection: {
    alignItems: 'flex-end',
    marginRight: 12,
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
  removeButton: {
    padding: 4,
  },
});

export default WatchlistBottomSheet; 