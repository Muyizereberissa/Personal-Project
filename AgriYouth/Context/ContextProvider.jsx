import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function UseAuth() {
  return useContext(AuthContext);
}

export default function ThemeContext({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setDarkMode(JSON.parse(savedTheme));
      }
    };

    fetchTheme();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const register = async (email, password) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully:", user);
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  const login = async (email, password) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully:", user);
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending reset email:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const updateEmail = async (email) => {
    if (currentUser) {
      try {
        await currentUser.updateEmail(email);
        console.log("Email updated successfully");
      } catch (error) {
        console.error("Error updating email:", error.message);
      }
    }
  };

  const updatePassword = async (password) => {
    if (currentUser) {
      try {
        await currentUser.updatePassword(password);
        console.log("Password updated successfully");
      } catch (error) {
        console.error("Error updating password:", error.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      register,
      login,
      darkMode,
      toggleDarkMode,
      resetPassword,
      currentUser,
      logout,
      updateEmail,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}
