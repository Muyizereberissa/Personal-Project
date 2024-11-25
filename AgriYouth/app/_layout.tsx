import React from "react";
import { Stack } from "expo-router";
import ThemeContext from "../Context/ContextProvider"; // Ensure the path is correct
import Header from './Header'
import BottomTabs from './BottomTabs'

export default function RootLayout() {
  return (
    <ThemeContext>
      {/* <Header/> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"  />
        {/* <Stack.Screen name="OnboardingScreen"/> */}
        <Stack.Screen name="Login" />
        <Stack.Screen name="Register" />
        <Stack.Screen name="ForgotPassword" />
        <Stack.Screen name="BottomTabs"/>
        <Stack.Screen name="UpdateProfile"/>
        <Stack.Screen name="PostedIdeas"/>
        <Stack.Screen name="JoinGroups"/>
        <Stack.Screen name="GroupDetails"/>
      </Stack>
    </ThemeContext>
  );
}
