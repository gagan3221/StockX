import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TopGainersLosersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Top Gainers/Losers Screen (Mock)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
}); 