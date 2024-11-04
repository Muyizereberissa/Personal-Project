import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UseAuth } from "../Context/ContextProvider";

export default function Home() {
  const { darkMode } = UseAuth();

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={{ color: darkMode ? "#fff" : "#000" }}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    alignItems: 'flex-start',
    justifyContent: "center",
  },
  darkContainer: {
    backgroundColor: "#000",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
});
