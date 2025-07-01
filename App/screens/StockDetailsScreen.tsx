import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function StockDetailsScreen({ route, navigation }: any) {
  const { stock } = route.params || { 
    stock: { 
      name: 'AAPL', 
      price: '$177.04', 
      change: '+$1.24', 
      changePercent: '+0.70%',
      fullName: 'Apple Inc.'
    } 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details Screen</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Icon name="bookmark-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stock Info */}
        <View style={styles.stockInfo}>
          <View style={styles.stockHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🍎</Text>
            </View>
            <View style={styles.stockDetails}>
              <Text style={styles.stockName}>{stock.fullName || 'Apple Inc.'}</Text>
              <Text style={styles.stockSymbol}>{stock.name || 'AAPL'}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{stock.price || '$177.04'}</Text>
              <Text style={styles.change}>+$1.24 (+0.70%)</Text>
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
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About AAPL INC</Text>
          <Text style={styles.aboutText}>
            Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes its products through its retail stores, online stores, and direct sales force, as well as through third-party cellular network carriers, wholesalers, retailers, and resellers. The company was formerly known as Apple Computer, Inc. and changed its name to Apple Inc. in January 2007. Apple Inc. was founded in 1976 and is headquartered in Cupertino, California.
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsSection}>
          <View style={styles.metricRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>52 Week Low</Text>
              <Text style={styles.metricValue}>$124.64</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Current price</Text>
              <Text style={styles.metricValue}>$177.04</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>52 Week High</Text>
              <Text style={styles.metricValue}>$199.62</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Volume (avg)</Text>
              <Text style={styles.metricValue}>48.27M</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>P/E Ratio</Text>
              <Text style={styles.metricValue}>29.09</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Dividend Yield</Text>
              <Text style={styles.metricValue}>0.43%</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Market Cap</Text>
              <Text style={styles.metricValue}>$2.77T</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Beta</Text>
              <Text style={styles.metricValue}>1.24</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Profit Margin</Text>
              <Text style={styles.metricValue}>25.31%</Text>
            </View>
          </View>
        </View>
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
  },
  stockInfo: {
    padding: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
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
    marginBottom: 2,
  },
  change: {
    color: '#4CAF50',
    fontSize: 14,
  },
  chartContainer: {
    padding: 16,
    paddingTop: 0,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    height: 200,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  chartLine: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 1,
  },
  chartPlaceholder: {
    color: '#666',
    fontSize: 14,
  },
  timePeriods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activePeriod: {
    backgroundColor: '#333',
  },
  periodText: {
    color: '#aaa',
    fontSize: 14,
  },
  activePeriodText: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sellButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aboutText: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
  },
  metricsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 