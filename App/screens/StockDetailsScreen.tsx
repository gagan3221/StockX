import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWatchlist } from '../../components/WatchlistContext';
import { alphaVantageAPI, CompanyOverview } from '../../services/AlphaVantageAPI';

export default function StockDetailsScreen({ route, navigation }: any) {
  const { stock } = route.params || { 
    stock: { 
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: '$177.04', 
      change: '+$1.24', 
      changePercent: '+0.70%',
    } 
  };

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const isBookmarked = isInWatchlist(stock.id || stock.symbol);
  
  const [companyData, setCompanyData] = useState<CompanyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanyData();
  }, [stock.symbol]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alphaVantageAPI.getCompanyOverview(stock.symbol || stock.name);
      setCompanyData(data);
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkPress = () => {
    if (isBookmarked) {
      removeFromWatchlist(stock.id || stock.symbol);
    } else {
      addToWatchlist({
        id: stock.id || stock.symbol,
        symbol: stock.symbol || stock.name,
        name: companyData?.Name || stock.name || 'Unknown Company',
        price: stock.price || '$0.00',
        change: stock.change || '0',
        changePercent: stock.changePercent || '0%',
        volume: stock.volume || '0',
      });
    }
  };

  const formatLargeNumber = (value: string | undefined) => {
    if (!value || value === 'None' || value === '-') return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (value: string | undefined) => {
    if (!value || value === 'None' || value === '-') return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    return `${(num * 100).toFixed(2)}%`;
  };

  const formatNumber = (value: string | undefined) => {
    if (!value || value === 'None' || value === '-') return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    return num.toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Details</Text>
        <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmarkPress}>
          <Icon 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isBookmarked ? "#4CAF50" : "#fff"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stock Info */}
        <View style={styles.stockInfo}>
          <View style={styles.stockHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                {stock.symbol === 'AAPL' ? '🍎' : 
                 stock.symbol === 'GOOGL' ? '🔍' : 
                 stock.symbol === 'TSLA' ? '🚗' : 
                 stock.symbol === 'AMZN' ? '📦' : '📈'}
              </Text>
            </View>
            <View style={styles.stockDetails}>
              <Text style={styles.stockName}>
                {loading ? 'Loading...' : companyData?.Name || stock.name || 'Unknown Company'}
              </Text>
              <Text style={styles.stockSymbol}>{stock.symbol || stock.name}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{stock.price}</Text>
              <Text style={[styles.change, { color: stock.changePercent?.startsWith('+') ? '#4CAF50' : '#F44336' }]}>
                {stock.changePercent || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>1D</Text>
          <View style={styles.chart}>
            {/* Simple chart placeholder */}
            <View style={styles.chartLine} />
            <Text style={styles.chartPlaceholder}>Chart visualization would go here</Text>
          </View>
          
          {/* Time Period Buttons */}
          <View style={styles.timePeriods}>
            {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((period, index) => (
              <TouchableOpacity 
                key={period} 
                style={[styles.periodButton, index === 0 && styles.activePeriod]}
              >
                <Text style={[styles.periodText, index === 0 && styles.activePeriodText]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellButton}>
            <Text style={styles.sellButtonText}>Sell</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading company information...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load company information</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCompanyData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : companyData ? (
          <>
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About {companyData.Name}</Text>
              <Text style={styles.aboutText}>
                {companyData.Description || 'No description available for this company.'}
              </Text>
              {companyData.Sector && (
                <View style={styles.companyInfo}>
                  <Text style={styles.infoLabel}>Sector: <Text style={styles.infoValue}>{companyData.Sector}</Text></Text>
                  {companyData.Industry && (
                    <Text style={styles.infoLabel}>Industry: <Text style={styles.infoValue}>{companyData.Industry}</Text></Text>
                  )}
                  {companyData.Country && (
                    <Text style={styles.infoLabel}>Country: <Text style={styles.infoValue}>{companyData.Country}</Text></Text>
                  )}
                </View>
              )}
            </View>

            {/* Key Metrics */}
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>Key Metrics</Text>
              
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>52 Week Low</Text>
                  <Text style={styles.metricValue}>{companyData['52WeekLow'] ? `$${parseFloat(companyData['52WeekLow']).toFixed(2)}` : 'N/A'}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Current Price</Text>
                  <Text style={styles.metricValue}>{stock.price}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>52 Week High</Text>
                  <Text style={styles.metricValue}>{companyData['52WeekHigh'] ? `$${parseFloat(companyData['52WeekHigh']).toFixed(2)}` : 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Market Cap</Text>
                  <Text style={styles.metricValue}>{formatLargeNumber(companyData.MarketCapitalization)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>P/E Ratio</Text>
                  <Text style={styles.metricValue}>{formatNumber(companyData.PERatio)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Dividend Yield</Text>
                  <Text style={styles.metricValue}>{formatPercentage(companyData.DividendYield)}</Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Beta</Text>
                  <Text style={styles.metricValue}>{formatNumber(companyData.Beta)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Profit Margin</Text>
                  <Text style={styles.metricValue}>{formatPercentage(companyData.ProfitMargin)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>EPS</Text>
                  <Text style={styles.metricValue}>{formatNumber(companyData.EPS)}</Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Book Value</Text>
                  <Text style={styles.metricValue}>{formatNumber(companyData.BookValue)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Revenue TTM</Text>
                  <Text style={styles.metricValue}>{formatLargeNumber(companyData.RevenueTTM)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>EBITDA</Text>
                  <Text style={styles.metricValue}>{formatLargeNumber(companyData.EBITDA)}</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
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
  bookmarkButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stockInfo: {
    marginTop: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
  },
  stockDetails: {
    flex: 1,
  },
  stockName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockSymbol: {
    color: '#aaa',
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chart: {
    height: 150,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  chartLine: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#4CAF50',
    transform: [{ rotate: '15deg' }],
  },
  chartPlaceholder: {
    color: '#666',
    fontSize: 12,
  },
  timePeriods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activePeriod: {
    backgroundColor: '#4CAF50',
  },
  periodText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
  },
  activePeriodText: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sellButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  aboutSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aboutText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  companyInfo: {
    marginTop: 8,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontWeight: '600',
  },
  metricsSection: {
    marginBottom: 24,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  metricLabel: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 