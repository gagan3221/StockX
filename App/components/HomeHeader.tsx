import React from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image source={require('../Assets/stockxlogo.png')} style={styles.logo} />
      <View style={styles.searchBar}>
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