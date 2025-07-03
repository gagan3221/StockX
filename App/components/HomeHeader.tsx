import React, { useContext } from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../theme/ThemeContext';

export default function HomeHeader() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  return (
    <View style={[styles.headerContainer, { backgroundColor: isDark ? '#000' : '#fff' }] }>
      <Image source={isDark ? require('../Assets/stockxlogo.png') : require('../Assets/stockxblacklogo.png')} style={styles.logo} />
      <View style={[styles.searchBar, { backgroundColor: isDark ? '#181818' : '#e0e0e0' }] }>
        <Icon name="search" size={20} color="#888" style={{ marginLeft: 8 }} />
        <TextInput
          placeholder="Search stocks..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 24,
    marginLeft: 16,
    paddingHorizontal: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
}); 