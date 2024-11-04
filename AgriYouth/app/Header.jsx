import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UseAuth } from '../Context/ContextProvider';

const Header = () => {
  const { toggleDarkMode, darkMode } = UseAuth();

  return (
    <View style={[styles.header, darkMode ? styles.dark : styles.light]}>
      <TouchableOpacity onPress={toggleDarkMode} style={styles.button}>
        <Text style={styles.buttonText}>
          Switch to {darkMode ? 'Light' : 'Dark'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dark: {
    backgroundColor: '#333',
  },
  light: {
    backgroundColor: '#fff',
  },
});

export default Header;
