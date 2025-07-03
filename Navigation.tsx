import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import HomeScreen from './App/screens/HomeScreen';
import WatchlistScreen from './App/screens/WatchlistScreen';
import StockDetailsScreen from './App/screens/StockDetailsScreen';
import TopGainersLosersScreen from './App/screens/TopGainersLosersScreen';
import HomeHeader from './App/components/HomeHeader';
import SettingsScreen from './App/screens/SettingsScreen';
import { ThemeContext } from './App/theme/ThemeContext';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  return (
    <NavigationContainer>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#000' : '#fff'} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
          headerTintColor: isDark ? '#fff' : '#111',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: () => <HomeHeader />,
          }}
        />
        <Stack.Screen name="Watchlist" component={WatchlistScreen} options={{headerShown: false}} />
        <Stack.Screen name="StockDetails" component={StockDetailsScreen} options={{headerShown: false}} />
        <Stack.Screen name="TopGainersLosers" component={TopGainersLosersScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 