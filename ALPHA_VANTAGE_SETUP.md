# Alpha Vantage API Integration Setup

This guide will help you set up real stock data in your StockX app using the Alpha Vantage API.

## 🚀 What's New

Your StockX app now features real-time stock data from Alpha Vantage instead of mock data:

- **Real Stock Prices**: Live stock prices, changes, and percentages
- **Company Information**: Detailed company overviews, financials, and metrics
- **Stock Search**: Search for any stock by symbol or company name
- **Top Gainers/Losers**: Real market data for top performing stocks
- **Most Active Stocks**: See which stocks are being traded most

## 📋 Prerequisites

1. A free Alpha Vantage API account
2. React Native development environment set up

## 🔧 Setup Instructions

### Step 1: Get Your Alpha Vantage API Key

1. Visit [Alpha Vantage API Key Registration](https://www.alphavantage.co/support/#api-key)
2. Fill out the form with your information
3. Choose "Free" for the API key type
4. Click "GET FREE API KEY"
5. Copy your API key (it will look like: `ABC123DEFG456HIJK`)

### Step 2: Configure Your API Key

1. Open the file `config/api.ts` in your project
2. Replace `'YOUR_ALPHA_VANTAGE_API_KEY'` with your actual API key:

```typescript
export const ALPHA_VANTAGE_API_KEY = 'ABC123DEFG456HIJK'; // Your actual key here
```

3. Save the file

### Step 3: Test Your Setup

1. Start your React Native app:
   ```bash
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

2. The app should now load real stock data on the home screen

## 📱 New Features

### Real-Time Stock Data
- Home screen now shows real top gainers, losers, and most active stocks
- Stock details include real company information and financial metrics
- Prices and changes update from live market data

### Stock Search
- Access the search screen from the bottom navigation
- Search for stocks by symbol (e.g., "AAPL") or company name (e.g., "Apple")
- Add any stock to your watchlist directly from search results

### Enhanced Stock Details
- Real company descriptions and sector information
- Live financial metrics including P/E ratio, market cap, dividend yield
- 52-week high/low data and other key performance indicators

### Improved Watchlist
- Stocks added to watchlist include real company names
- Better integration with live stock data
- Search and add functionality

## 🔄 API Endpoints Used

The app uses these Alpha Vantage API endpoints:

1. **TOP_GAINERS_LOSERS**: For home screen market movers
2. **OVERVIEW**: For detailed company information
3. **SYMBOL_SEARCH**: For stock search functionality

## ⚠️ API Limitations

The free Alpha Vantage API has some limitations:

- **Rate Limit**: 5 API calls per minute, 500 calls per day
- **Data Delay**: Stock prices may be delayed by 15-20 minutes
- **Quota**: Monitor your usage to avoid hitting daily limits

## 🔒 Security Notes

- Keep your API key secure and private
- Don't commit your API key to public repositories
- For production apps, consider using environment variables or secure key storage

## 🐛 Troubleshooting

### "Cannot find module" Error
Make sure you've created the `config/api.ts` file and exported the API key correctly.

### "API call frequency limit reached" Error
You've hit the rate limit. Wait a minute before making more requests, or upgrade to a paid plan.

### "Invalid API Key" Error
Double-check that you've copied your API key correctly without any extra spaces or characters.

### Empty Data or Loading Issues
- Check your internet connection
- Verify your API key is correct
- Check if you've exceeded your daily quota

## 📈 Usage Tips

1. **Search Efficiently**: Use specific stock symbols for faster, more accurate results
2. **Monitor API Usage**: Keep track of your daily API calls to stay within limits
3. **Refresh Data**: Use pull-to-refresh on screens to get the latest data
4. **Watchlist Management**: Use the search feature to build comprehensive watchlists

## 🔮 Future Enhancements

Potential improvements you could add:

- Historical stock price charts
- Real-time price alerts
- Portfolio tracking
- News integration
- Options and futures data
- International market support

## 📞 Support

If you encounter issues:

1. Check the Alpha Vantage [documentation](https://www.alphavantage.co/documentation/)
2. Verify your API key status in your Alpha Vantage account
3. Check the app logs for specific error messages
4. Ensure you haven't exceeded API rate limits

## 📝 API Key Management

For production apps, consider:

- Using React Native Config for environment variables
- Implementing secure key storage
- Setting up CI/CD with secret management
- Monitoring API usage and costs

---

**Enjoy your new real-time stock data! 📊** 