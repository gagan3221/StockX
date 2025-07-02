// Mock data for when API rate limits are reached
// This allows users to still see the app functionality

import { Stock } from './AlphaVantageAPI';

export const mockTopGainers: Stock[] = [
  {
    id: 'AAPL',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: '$177.04',
    change: '+$2.15',
    changePercent: '+1.23%',
    volume: '45123456'
  },
  {
    id: 'MSFT',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: '$378.85',
    change: '+$4.72',
    changePercent: '+1.26%',
    volume: '23567890'
  },
  {
    id: 'GOOGL',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: '$142.56',
    change: '+$1.87',
    changePercent: '+1.33%',
    volume: '19876543'
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: '$248.48',
    change: '+$3.21',
    changePercent: '+1.31%',
    volume: '87654321'
  }
];

export const mockTopLosers: Stock[] = [
  {
    id: 'META',
    symbol: 'META',
    name: 'Meta Platforms',
    price: '$295.89',
    change: '-$4.12',
    changePercent: '-1.37%',
    volume: '34567890'
  },
  {
    id: 'NFLX',
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: '$468.23',
    change: '-$5.67',
    changePercent: '-1.20%',
    volume: '12345678'
  },
  {
    id: 'UBER',
    symbol: 'UBER',
    name: 'Uber Technologies',
    price: '$65.43',
    change: '-$0.89',
    changePercent: '-1.34%',
    volume: '45678901'
  },
  {
    id: 'PYPL',
    symbol: 'PYPL',
    name: 'PayPal Holdings',
    price: '$78.92',
    change: '-$1.23',
    changePercent: '-1.53%',
    volume: '23456789'
  }
];

export const mockMostActive: Stock[] = [
  {
    id: 'SPY',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    price: '$445.67',
    change: '+$0.23',
    changePercent: '+0.05%',
    volume: '123456789'
  },
  {
    id: 'QQQ',
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    price: '$376.89',
    change: '+$1.45',
    changePercent: '+0.39%',
    volume: '98765432'
  },
  {
    id: 'NVDA',
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: '$875.12',
    change: '+$12.34',
    changePercent: '+1.43%',
    volume: '67890123'
  },
  {
    id: 'AMZN',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: '$145.78',
    change: '+$0.89',
    changePercent: '+0.62%',
    volume: '56789012'
  }
]; 