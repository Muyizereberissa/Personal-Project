import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons"; // Choose the icon set you prefer
import { UseAuth } from "../Context/ContextProvider";
import HomeScreen from "./Home";
import ProfileScreen from "./Profile";
import SettingsScreen from "./Settings";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { darkMode } = UseAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: darkMode ? "#000" : "#fff",
        },
        tabBarActiveTintColor: darkMode ? "green" : "green",
        tabBarInactiveTintColor: darkMode ? "#777" : "#888",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
      <Tab.Screen name="Settings" component={SettingsScreen}/>
    </Tab.Navigator>
  );
}
