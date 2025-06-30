import React from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeHeader() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Image source={require('../App/Assets/stockxlogo.png')} style={styles.logo} />
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#000" style={{ marginLeft: 8 }} />
          <TextInput
            placeholder="Search stocks..."
            placeholderTextColor="#000"
            style={styles.searchInput}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000',
  },
  headerContainer: {
    backgroundColor: '#000',
    paddingTop: 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    marginLeft: 16,
    paddingHorizontal: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    marginLeft: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
}); 