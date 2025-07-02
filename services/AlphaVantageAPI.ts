import { ALPHA_VANTAGE_API_KEY } from '../config/api';

const API_KEY = ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
}

export interface CompanyOverview {
  Symbol: string;
  Name: string;
  Description: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  '50DayMovingAverage': string;
  '200DayMovingAverage': string;
  SharesOutstanding: string;
  DividendDate: string;
  ExDividendDate: string;
}

export interface TopGainersLosersResponse {
  metadata: string;
  last_updated: string;
  top_gainers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  top_losers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  most_actively_traded: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
}

export interface SearchResult {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

class AlphaVantageAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = BASE_URL;
  }

  // Fetch Top Gainers and Losers
  async getTopGainersLosers(): Promise<TopGainersLosersResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=TOP_GAINERS_LOSERS&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching top gainers/losers:', error);
      throw error;
    }
  }

  // Get Company Overview
  async getCompanyOverview(symbol: string): Promise<CompanyOverview> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching company overview:', error);
      throw error;
    }
  }

  // Search for stocks by keyword
  async searchSymbol(keywords: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }
      
      return data.bestMatches || [];
    } catch (error) {
      console.error('Error searching symbols:', error);
      throw error;
    }
  }

  // Transform API data to our app's Stock interface
  transformToStock(apiStock: any, type: 'gainer' | 'loser' | 'active'): Stock {
    return {
      id: apiStock.ticker,
      symbol: apiStock.ticker,
      name: apiStock.ticker, // We'll get full name from company overview if needed
      price: `$${parseFloat(apiStock.price).toFixed(2)}`,
      change: `${apiStock.change_amount.startsWith('-') ? '' : '+'}$${Math.abs(parseFloat(apiStock.change_amount)).toFixed(2)}`,
      changePercent: apiStock.change_percentage,
      volume: apiStock.volume,
    };
  }

  // Get formatted stocks for each category
  async getTopGainers(): Promise<Stock[]> {
    const data = await this.getTopGainersLosers();
    return data.top_gainers.slice(0, 10).map(stock => this.transformToStock(stock, 'gainer'));
  }

  async getTopLosers(): Promise<Stock[]> {
    const data = await this.getTopGainersLosers();
    return data.top_losers.slice(0, 10).map(stock => this.transformToStock(stock, 'loser'));
  }

  async getMostActive(): Promise<Stock[]> {
    const data = await this.getTopGainersLosers();
    return data.most_actively_traded.slice(0, 10).map(stock => this.transformToStock(stock, 'active'));
  }
}

export const alphaVantageAPI = new AlphaVantageAPI(); 