import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWatchlist } from '../components/WatchlistContext';
import { alphaVantageAPI, CompanyOverview } from '../../services/AlphaVantageAPI';
import { ThemeContext } from '../theme/ThemeContext';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';
import { mockTopGainers } from '../../services/mockData';

const MOCK_CHARTS = {
  '1D': [10, 20, 15, 25, 30, 28, 35],
  '1W': [15, 18, 22, 20, 25, 30, 32],
  '1M': [20, 22, 18, 25, 28, 30, 35],
  '3M': [25, 28, 30, 32, 35, 38, 40],
  '1Y': [30, 32, 35, 38, 40, 42, 45],
  '5Y': [20, 25, 30, 35, 40, 45, 50],
};

function getLinePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    d += ` L ${p.x} ${p.y}`;
  }
  return d;
}

function getAreaPath(points: { x: number; y: number }[], height: number) {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${height} L ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    d += ` L ${p.x} ${p.y}`;
  }
  d += ` L ${points[points.length - 1].x} ${height} Z`;
  return d;
}

function MockChart({ data, color, isDark }: { data: number[]; color: string; isDark: boolean }) {
  // Realistic line chart using SVG
  const width = '100%';
  const height = 80;
  const viewBoxWidth = 300; // for scaling points
  const viewBoxHeight = 80;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (viewBoxWidth - 10) + 5,
    y: viewBoxHeight - 10 - ((v - min) / (max - min || 1)) * (viewBoxHeight - 20),
  }));
  const linePath = getLinePath(points);
  const areaPath = getAreaPath(points, viewBoxHeight - 10);
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      <Defs>
        <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2={viewBoxHeight}>
          <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={isDark ? '#000' : '#fff'} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={areaPath} fill="url(#chartGradient)" />
      <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" />
    </Svg>
  );
}

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
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1D');
  const [sampleMode, setSampleMode] = useState(false);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchCompanyData();
  }, [stock.symbol]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSampleMode(false);
      const data = await alphaVantageAPI.getCompanyOverview(stock.symbol || stock.name);
      setCompanyData(data);
    } catch (err) {
      console.error('Error fetching company data:', err);
      if (err instanceof Error && err.message && err.message.toLowerCase().includes('daily api limit')) {
        setError('You have reached the daily limit for stock data. Showing sample data.');
      } else {
        setError('Unable to load stock details at the moment. Showing sample data.');
      }
      // Use sample data
      setCompanyData({
        Name: stock.name || 'Sample Company',
        Description: 'This is sample company data shown because live data is unavailable.',
        Sector: 'Technology',
        Industry: 'Software',
        Country: 'USA',
        ...stock,
      });
      setSampleMode(true);
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }] }>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#ccc', backgroundColor: isDark ? '#000' : '#fff' }] }>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#fff' : '#111'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#111' }]}>Stock Details</Text>
        <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmarkPress}>
          <Icon 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isBookmarked ? "#4CAF50" : isDark ? "#fff" : "#111"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stock Info */}
        <View style={[styles.stockInfo, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }] }>
          <View style={styles.stockHeader}>
            <View style={[styles.logoContainer, { backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0' }] }>
              <Text style={[styles.logoText, { color: isDark ? '#fff' : '#111' }]}>
                {stock.symbol === 'AAPL' ? '🍎' : 
                 stock.symbol === 'GOOGL' ? '🔍' : 
                 stock.symbol === 'TSLA' ? '🚗' : 
                 stock.symbol === 'AMZN' ? '📦' : '📈'}
              </Text>
            </View>
            <View style={styles.stockDetails}>
              <Text style={[styles.stockName, { color: isDark ? '#fff' : '#111' }]}>
                {loading ? 'Loading...' : companyData?.Name || stock.name || 'Unknown Company'}
              </Text>
              <Text style={[styles.stockSymbol, { color: isDark ? '#aaa' : '#333' }]}>{stock.symbol || stock.name}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: isDark ? '#fff' : '#111' }]}>{stock.price}</Text>
              <Text style={[styles.change, { color: stock.changePercent?.startsWith('+') ? '#4CAF50' : '#F44336' }]}>
                {stock.changePercent || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{selectedPeriod}</Text>
          <View style={styles.chart}>
            <MockChart data={MOCK_CHARTS[selectedPeriod]} color={isDark ? '#4CAF50' : '#2196F3'} isDark={isDark} />
          </View>
          {/* Time Period Buttons */}
          <View style={styles.timePeriods}>
            {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((period) => (
              <TouchableOpacity 
                key={period} 
                style={[styles.periodButton, selectedPeriod === period && styles.activePeriod]}
                onPress={() => setSelectedPeriod(period as '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y')}
              >
                <Text style={[styles.periodText, selectedPeriod === period && styles.activePeriodText]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellButton}>
            <Text style={styles.sellButtonText}>Sell</Text>
          </TouchableOpacity>
        </View> */}

        {/* About Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading company information...</Text>
          </View>
        ) : error && sampleMode ? (
          <View style={styles.errorContainer}>
            <Icon name="warning-outline" size={32} color="#F44336" style={{ marginBottom: 8 }} />
            <Text style={styles.errorText}>{error}</Text>
            {/* Show sample data below */}
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About {companyData?.Name}</Text>
              <Text style={styles.aboutText}>{companyData?.Description}</Text>
              <View style={styles.companyInfo}>
                <Text style={styles.infoLabel}>Sector: <Text style={styles.infoValue}>{companyData?.Sector}</Text></Text>
                <Text style={styles.infoLabel}>Industry: <Text style={styles.infoValue}>{companyData?.Industry}</Text></Text>
                <Text style={styles.infoLabel}>Country: <Text style={styles.infoValue}>{companyData?.Country}</Text></Text>
              </View>
            </View>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockSymbol: {
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
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