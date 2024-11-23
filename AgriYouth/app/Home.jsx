import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FIREBASE_DB } from "../FirebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { UseAuth } from "../Context/ContextProvider";
import { useNavigation } from "@react-navigation/native";

export default function HomePage() {
  const { darkMode } = UseAuth();
  const [categories, setCategories] = useState([]);
  const [mentors, setMentors] = useState([]); // State for mentors
  const [searchQuery, setSearchQuery] = useState("");
  const [isPostIdeaModalVisible, setPostIdeaModalVisible] = useState(false);
  const [ideaContent, setIdeaContent] = useState("");

  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(FIREBASE_DB, "AgricultureCategories");
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorCollection = collection(FIREBASE_DB, "Mentors");
        const mentorSnapshot = await getDocs(mentorCollection);
        const mentorList = mentorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMentors(mentorList);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  const handleSearch = (text) => setSearchQuery(text);

  return (
    <View style={[styles.container, darkMode ? styles.darkMode : styles.lightMode]}>
      {/* Search Bar */}
      <View
        style={[styles.searchContainer, darkMode ? styles.darkSearch : styles.lightSearch]}
      >
        <Icon
          name="search"
          size={20}
          color={darkMode ? "#888" : "#666"}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            darkMode ? styles.darkText : styles.lightText,
          ]}
          placeholder="Search Categories..."
          placeholderTextColor={darkMode ? "#888" : "#666"}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.icons}>
  <TouchableOpacity
    style={[
      styles.iconButton,
      darkMode ? styles.darkIcon : styles.lightIcon,
    ]}
    onPress={() => navigation.navigate("PostedIdeas")}
  >
    <Icon name="book" size={24} color={darkMode ? "#fff" : "#333"} />
  </TouchableOpacity>
  <TouchableOpacity
    style={[
      styles.iconButton,
      darkMode ? styles.darkIcon : styles.lightIcon,
    ]}
    onPress={() => navigation.navigate("JoinGroups")}
  >
    <Icon name="group" size={24} color={darkMode ? "#fff" : "#333"} />
  </TouchableOpacity>
</View>

      <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
        Explore Agriculture Categories
      </Text>

      {/* Categories Section */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View>
            <Text
              style={[styles.cardTitle, darkMode ? styles.darkCardText : styles.lightCardText]}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.description, darkMode ? styles.darkCardText : styles.lightCardText]}
            >
              {item.description}
            </Text>
            </View>
          </View>
        )}
      />
   
      <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
        Connect with Mentors
      </Text>

      
<FlatList
  data={mentors}
  showsVerticalScrollIndicator={true} // Show vertical scroll indicator
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={[styles.mentorCard, darkMode ? styles.darkCard : styles.lightCard]}>
      <Image source={{ uri: item.mentorImage }} style={styles.mentorImage} />
      <View style={styles.mentorDetails}>
        <Text
          style={[
            styles.mentorName,
            darkMode ? styles.darkCardText : styles.lightCardText,
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.mentorBio,
            darkMode ? styles.darkCardText : styles.lightCardText,
          ]}
        >
          {item.bio}
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => alert(`Contacting ${item.name}`)}
        >
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
  style={{ marginTop: 10 }} // Add some spacing for the mentor list
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 25
  },
  icons: { 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16, // Add some space below the icons section
  },
  iconButton: {
    padding: 10, // Add padding for easier touch interaction
    borderRadius: 8, // Round the edges for a better UI
  },
  darkIcon: {
    backgroundColor: '#444', 
    color: '#fff',
  },
  lightIcon: {
    backgroundColor: '#eaeaea', 
    color: '#333', 
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  // post: {}
  darkMode: {
    backgroundColor: "#222",
  },
  lightMode: {
    backgroundColor: "#f9f9f9",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaeaea",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
    flexDirection: "column",
    maxWidth: 320,
    paddingHorizontal: 10,
    maxHeight: 480,
    height: 420
  },
  image: {
    width: 300,
    height: 180,
    borderRadius: 12,
    marginBottom: 5,
    position: "relative",
  },
  cardTitle: {
    fontSize: 20, // Adjust font size for the title
    fontWeight: "bold", // Add space between title and description
    color: "#333",
  },

  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
    flexWrap: "wrap", 
  },
  darkCard: {
    backgroundColor: "#333",
  },
  lightCard: {
    backgroundColor: "#fff",
  },
  darkCardText: {
    color: "#fff",
  },
  lightCardText: {
    color: "#333",
  },
  darkButton: {
    backgroundColor: "#4CAF50",
  },
  lightButton: {
    backgroundColor: "#4CAF50",
  },
  darkSearch: {
    backgroundColor: "#444",
  },
  lightSearch: {
    backgroundColor: "#eaeaea",
  },
  darkButtonText: {
    color: "#fff",
  },
  lightButtonText: {
    color: "#fff",
  },
  buto: {
    display: "flex",
    flexDirection: "row",
  },
  contactButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '50%',
    alignSelf: 'center'
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    
  },
  mentorCard: {
    flexDirection: "row", // Align items horizontally
    alignItems: "flex-start", // Align items at the top
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 10,
    marginBottom: 16, // Add space between cards
  },
  mentorImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12, // Space between image and details
  },
  mentorDetails: {
    flex: 1, // Allow details to take up remaining space
  },
  mentorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: 'center'
  },
  mentorBio: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    //  textAlign: 'center'
  },
});
