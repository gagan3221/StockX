/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Navigation from './Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WatchlistProvider } from '../StockX/App/components/WatchlistContext';
import { ThemeProvider } from './App/theme/ThemeContext';
import { Provider } from 'react-redux';
import store from './App/store';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <WatchlistProvider>
              <View style={styles.container}>
                <Navigation />
              </View>
            </WatchlistProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
