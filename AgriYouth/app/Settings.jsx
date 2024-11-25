import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { UseAuth } from "../Context/ContextProvider";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";

export default function SettingsScreen() {
  const { darkMode, toggleDarkMode } = UseAuth();
  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }], // Ensure user can't go back to authenticated screens
              });
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
              console.error("Logout error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleNotificationsToggle = () => {
    Alert.alert("Notifications", "This feature will be implemented soon!");
  };

  const handleAccountSettings = () => {
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
          value={false}
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
      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    top: 50
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
