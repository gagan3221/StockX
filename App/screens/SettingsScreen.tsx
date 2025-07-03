import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, Image } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}> 
      <View style={styles.logoContainer}>
        <Image
          source={isDark ? require('../Assets/stockxlogo.png') : require('../Assets/stockxblacklogo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? '#4CAF50' : '#888'}
          trackColor={{ false: '#ccc', true: '#333' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
  },
}); 