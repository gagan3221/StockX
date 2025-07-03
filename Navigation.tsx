import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import HomeScreen from './App/screens/HomeScreen';
import WatchlistScreen from './App/screens/WatchlistScreen';
import StockDetailsScreen from './App/screens/StockDetailsScreen';
import TopGainersLosersScreen from './App/screens/TopGainersLosersScreen';
import HomeHeader from './App/components/HomeHeader';
import SettingsScreen from './App/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
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