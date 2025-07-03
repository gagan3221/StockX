import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWatchlist } from '../../components/WatchlistContext';
import { ThemeContext } from '../theme/ThemeContext';

interface StockCardProps {
  symbol: string;
  name: string;
  price: string;
  changePercent: string;
  onPress: () => void;
  onRemove: () => void;
}

function WatchlistStockCard({ symbol, name, price, changePercent, onPress, onRemove }: StockCardProps) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const isPositive = changePercent.startsWith('+');
  let changeColor = isPositive ? '#4CAF50' : '#F44336';
  
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]} onPress={onPress}>
      {/* Remove button */}
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Icon name="close" size={18} color={isDark ? '#fff' : '#111'} />
      </TouchableOpacity>
      
      {/* Stock avatar */}
      <View style={[styles.avatar, { backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0' }]}>
        <Text style={[styles.avatarText, { color: isDark ? '#fff' : '#111' }]}>
          {symbol === 'AAPL' ? '🍎' : 
           symbol === 'GOOGL' ? '🔍' : 
           symbol === 'TSLA' ? '🚗' : 
           symbol === 'AMZN' ? '📦' : '📈'}
        </Text>
      </View>
      
      {/* Stock info */}
      <Text style={[styles.stockName, { color: isDark ? '#fff' : '#111' }]}>{name}</Text>
      <Text style={[styles.stockPrice, { color: isDark ? '#fff' : '#111' }]}>{price}</Text>
      <Text style={[styles.stockChange, { color: changeColor }]}>
        {changePercent}
      </Text>
    </TouchableOpacity>
  );
}

export default function WatchlistScreen({ navigation }: any) {
  const { 
    watchlists, 
    currentWatchlist, 
    currentWatchlistId,
    removeFromWatchlist, 
    createWatchlist, 
    deleteWatchlist, 
    renameWatchlist,
    setCurrentWatchlist 
  } = useWatchlist();

  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [showManageModal, setShowManageModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [selectedWatchlistId, setSelectedWatchlistId] = useState('');

  const handleStockPress = (stock: any) => {
    navigation.navigate('StockDetails', { stock });
  };

  const handleRemoveStock = (stockId: string) => {
    Alert.alert(
      'Remove Stock',
      'Are you sure you want to remove this stock from your watchlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromWatchlist(stockId) }
      ]
    );
  };

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      createWatchlist(newWatchlistName.trim());
      setNewWatchlistName('');
      setShowCreateModal(false);
    }
  };

  const handleDeleteWatchlist = (watchlistId: string) => {
    if (watchlists.length <= 1) {
      Alert.alert('Cannot Delete', 'You must have at least one watchlist.');
      return;
    }

    const watchlistName = watchlists.find(w => w.id === watchlistId)?.name || 'watchlist';
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${watchlistName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteWatchlist(watchlistId) }
      ]
    );
  };

  const handleRenameWatchlist = () => {
    if (newWatchlistName.trim()) {
      renameWatchlist(selectedWatchlistId, newWatchlistName.trim());
      setNewWatchlistName('');
      setShowRenameModal(false);
      setSelectedWatchlistId('');
    }
  };

  const openRenameModal = (watchlistId: string, currentName: string) => {
    setSelectedWatchlistId(watchlistId);
    setNewWatchlistName(currentName);
    setShowRenameModal(true);
  };

  const renderStockCard = ({ item }: { item: any }) => (
    <WatchlistStockCard
      symbol={item.symbol}
      name={item.name}
      price={item.price}
      changePercent={item.changePercent}
      onPress={() => handleStockPress(item)}
      onRemove={() => handleRemoveStock(item.id)}
    />
  );

  const currentStocks = currentWatchlist?.stocks || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }] }>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#ccc', backgroundColor: isDark ? '#000' : '#fff' }] }>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#fff' : '#111'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#111' }]}>{currentWatchlist?.name || 'Watchlist'}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowManageModal(true)}>
          <Icon name="ellipsis-vertical" size={24} color={isDark ? '#fff' : '#111'} />
        </TouchableOpacity>
      </View>

      {/* Watchlist Selector */}
      {watchlists.length > 1 && (
        <View style={[styles.watchlistSelector, { borderBottomColor: isDark ? '#333' : '#ccc' }] }>
          <FlatList
            data={watchlists}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.watchlistTab,
                  { backgroundColor: isDark ? '#1a1a1a' : '#e0e0e0' },
                  item.id === currentWatchlistId && { backgroundColor: '#2196F3' }
                ]}
                onPress={() => setCurrentWatchlist(item.id)}
              >
                <Text style={[
                  styles.watchlistTabText,
                  { color: isDark ? '#aaa' : '#333' },
                  item.id === currentWatchlistId && styles.activeWatchlistTabText
                ]}>
                  {item.name}
                </Text>
                <Text style={[styles.watchlistStockCount, { color: isDark ? '#666' : '#888' }]}>
                  {item.stocks.length} stocks
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Watchlist Content */}
      <View style={styles.content}>
        {currentStocks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="star-outline" size={64} color={isDark ? '#666' : '#bbb'} />
            <Text style={[styles.emptyText, { color: isDark ? '#fff' : '#111' }]}>No stocks in this watchlist</Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#aaa' : '#888' }]}>Add stocks from the home screen to track them here</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsHeader}>
              <Text style={[styles.stockCount, { color: isDark ? '#aaa' : '#333' }]}>{currentStocks.length} Stocks</Text>
            </View>
            <FlatList
              data={currentStocks}
              numColumns={2}
              keyExtractor={item => item.id}
              renderItem={renderStockCard}
              columnWrapperStyle={styles.cardRow}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>

      {/* Manage Watchlists Modal */}
      <Modal
        visible={showManageModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowManageModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manage Watchlists</Text>
            <TouchableOpacity onPress={() => setShowManageModal(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
              setShowManageModal(false);
              setShowCreateModal(true);
            }}
          >
            <Icon name="add-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.modalOptionText}>Create New Watchlist</Text>
          </TouchableOpacity>

          <View style={styles.watchlistsList}>
            <Text style={styles.watchlistsTitle}>Your Watchlists</Text>
            {watchlists.map(watchlist => (
              <View key={watchlist.id} style={styles.watchlistItem}>
                <View style={styles.watchlistInfo}>
                  <Text style={styles.watchlistName}>{watchlist.name}</Text>
                  <Text style={styles.watchlistMeta}>
                    {watchlist.stocks.length} stocks
                  </Text>
                </View>
                <View style={styles.watchlistActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowManageModal(false);
                      openRenameModal(watchlist.id, watchlist.name);
                    }}
                  >
                    <Icon name="create-outline" size={20} color="#2196F3" />
                  </TouchableOpacity>
                  {watchlists.length > 1 && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        setShowManageModal(false);
                        handleDeleteWatchlist(watchlist.id);
                      }}
                    >
                      <Icon name="trash-outline" size={20} color="#F44336" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Create Watchlist Modal */}
      <Modal
        visible={showCreateModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.modalDialog}>
            <Text style={styles.dialogTitle}>Create New Watchlist</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter watchlist name"
              placeholderTextColor="#666"
              value={newWatchlistName}
              onChangeText={setNewWatchlistName}
              autoFocus
            />
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewWatchlistName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.createButton]}
                onPress={handleCreateWatchlist}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename Watchlist Modal */}
      <Modal
        visible={showRenameModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View style={styles.overlayModal}>
          <View style={styles.modalDialog}>
            <Text style={styles.dialogTitle}>Rename Watchlist</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter new name"
              placeholderTextColor="#666"
              value={newWatchlistName}
              onChangeText={setNewWatchlistName}
              autoFocus
            />
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelButton]}
                onPress={() => {
                  setShowRenameModal(false);
                  setNewWatchlistName('');
                  setSelectedWatchlistId('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.createButton]}
                onPress={handleRenameWatchlist}
              >
                <Text style={styles.createButtonText}>Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop: 40,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 4,
  },
  watchlistSelector: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  watchlistTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
  },
  activeWatchlistTab: {
    backgroundColor: '#2196F3',
  },
  watchlistTabText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  activeWatchlistTabText: {
    color: '#fff',
  },
  watchlistStockCount: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsHeader: {
    paddingVertical: 16,
  },
  stockCount: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    minWidth: 140,
    maxWidth: '48%',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  watchlistsList: {
    flex: 1,
    padding: 16,
  },
  watchlistsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  watchlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  watchlistInfo: {
    flex: 1,
  },
  watchlistName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  watchlistMeta: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 2,
  },
  watchlistActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 16,
  },
  // Dialog styles
  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDialog: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  dialogTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
    marginRight: 8,
  },
  createButton: {
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 