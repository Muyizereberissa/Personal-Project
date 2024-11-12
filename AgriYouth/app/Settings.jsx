import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { UseAuth } from "../Context/ContextProvider";
import { useNavigation } from "@react-navigation/native";

export default function SettingsScreen() {
  const { darkMode, toggleDarkMode } = UseAuth();
  const navigation = useNavigation();

  const handleNotificationsToggle = () => {
    Alert.alert("Notifications", "This feature will be implemented soon!");
  };

  const handleAccountSettings = () => {
    // Navigate to Account Settings screen if you have one
    navigation.navigate("AccountSettingsScreen");
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.header, { color: darkMode ? "#fff" : "#000" }]}>Settings</Text>

      {/* Dark Mode Toggle */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: darkMode ? "#fff" : "#000" }]}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      {/* Notifications Toggle */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: darkMode ? "#fff" : "#000" }]}>Notifications</Text>
        <Switch
          value={false} // Replace with actual notification state if applicable
          onValueChange={handleNotificationsToggle}
          thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      {/* Account Settings */}
      <TouchableOpacity style={styles.settingItem} onPress={handleAccountSettings}>
        <Text style={[styles.settingText, { color: darkMode ? "#fff" : "#000" }]}>Account Settings</Text>
      </TouchableOpacity>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={() => Alert.alert("Sign Out", "Signing out...")}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  settingText: {
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 30,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#d9534f",
    borderRadius: 5,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
  },
});
