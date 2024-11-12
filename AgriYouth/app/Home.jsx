import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure you have installed the FontAwesome package
import { FIREBASE_DB } from "../FirebaseConfig"; // make sure firebase is configured here
import { collection, getDocs } from "firebase/firestore";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Toggle dark mode

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(FIREBASE_DB, "AgricultureCategories");
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredCategories = categories.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={[styles.container, darkMode ? styles.darkMode : styles.lightMode]}>
      {/* Search Bar with Icons */}
      <View style={[styles.searchContainer, darkMode ? styles.darkSearch : styles.lightSearch]}>
        <Icon name="search" size={20} color={darkMode ? "#888" : "#666"} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search Categories..."
          placeholderTextColor={darkMode ? "#888" : "#666"}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon name="microphone" size={20} color={darkMode ? "#888" : "#666"} style={styles.micIcon} />
      </View>

      {/* Title Section */}
      <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>Explore Agriculture Categories</Text>

      {/* Horizontal Scrollable List of Categories */}
      <FlatList
        data={filteredCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={[styles.cardTitle, darkMode ? styles.darkCardText : styles.lightCardText]}>
                {item.title}
              </Text>
            </View>
            <Text style={[styles.description, darkMode ? styles.darkText : styles.lightText]}>{item.description}</Text>
            <TouchableOpacity
              style={[styles.joinButton, darkMode ? styles.darkButton : styles.lightButton]}
              onPress={() => console.log("Joining group:", item.title)}
            >
              <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkMode: {
    backgroundColor: "#121212",
  },
  lightMode: {
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  darkSearch: {
    backgroundColor: "#333",
  },
  lightSearch: {
    backgroundColor: "#f0f0f0",
  },
  searchInput: {
    height: 40,
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  micIcon: {
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#333",
  },
  card: {
    width: 250,
    marginRight: 15,
    padding: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  lightCard: {
    backgroundColor: "#f8f9fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  darkCardText: {
    color: "#fff",
  },
  lightCardText: {
    color: "#333",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  darkButton: {
    backgroundColor: "#4CAF50",
  },
  lightButton: {
    backgroundColor: "#4CAF50",
  },
  joinButton: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
