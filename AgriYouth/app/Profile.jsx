import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UseAuth } from '../Context/ContextProvider'; 
export default function Profile() {
  const { darkMode } = UseAuth(); 
  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.text, darkMode ? styles.darkText : styles.lightText]}>
        Profile
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#000', 
  },
  lightContainer: {
    backgroundColor: '#fff', 
  },
  text: {
    fontSize: 18,
  },
  darkText: {
    color: '#fff', 
  },
  lightText: {
    color: '#000', 
  },
});
