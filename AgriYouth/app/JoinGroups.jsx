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
import { collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { UseAuth } from "../Context/ContextProvider"; // Import context
import PostedIdeas from "./PostedIdeas";
import { useNavigation } from "@react-navigation/native";

export default function JoinGroups() {
  const { darkMode } = UseAuth(); 
  const [categories, setCategories] = useState([]);
  const [ideas, setIdeas] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isJoinModalVisible, setJoinModalVisible] = useState(false);
  const [isPostIdeaModalVisible, setPostIdeaModalVisible] = useState(false);
  const [isInvestModalVisible, setInvestModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null); // Selected idea for investment
  const [ideaContent, setIdeaContent] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState(""); 
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(
          FIREBASE_DB,
          "AgricultureCategories"
        );
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

    const fetchIdeas = async () => {
      try {
        const ideaCollection = collection(FIREBASE_DB, "Ideas");
        const ideaSnapshot = await getDocs(ideaCollection);
        const ideaList = ideaSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIdeas(ideaList);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      }
    };

    fetchCategories();
    fetchIdeas();
  }, []);

  const handleSearch = (text) => setSearchQuery(text);

  const handleJoinGroup = async (categoryId) => {
    if (!currentUser) {
      alert("You need to be logged in to join a group.");
      return;
    }
    try {
      await addDoc(collection(FIREBASE_DB, "JoinedGroups"), {
        userId: currentUser.uid,
        categoryId,
      });
      alert("Successfully joined the group!");
      console.log("Group joined successfully for category:", categoryId);
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Error joining group. Check the console for details.");
    }
    setJoinModalVisible(false);
  };

  const handlePostIdea = async () => {
    if (!currentUser) {
      alert("You need to be logged in to post an idea.");
      return;
    }
    if (!ideaContent.trim()) {
      alert("Please enter a valid idea.");
      return;
    }
    try {
      await addDoc(collection(FIREBASE_DB, "Ideas"), {
        userId: currentUser.uid,
        categoryId: selectedCategory.id,
        content: ideaContent,
        timestamp: new Date(),
      });
      alert("Idea posted successfully!");
      setIdeaContent("");
      setPostIdeaModalVisible(false);
    } catch (error) {
      console.error("Error posting idea:", error);
      alert("Error posting idea. Check the console for details.");
    }
  };

  const handleCreateInvestment = async (ideaId) => {
    if (!currentUser) {
      alert("You need to be logged in to make an investment.");
      return;
    }
    if (!investmentAmount.trim()) {
      alert("Please enter a valid investment amount.");
      return;
    }
    try {
      await addDoc(collection(FIREBASE_DB, "Investments"), {
        userId: currentUser.uid,
        ideaId,
        investmentAmount,
        timestamp: new Date(),
      });
      alert("Investment has been recorded!");
      setInvestmentAmount("");
      setInvestModalVisible(false);
    } catch (error) {
      console.error("Error creating investment:", error);
      alert("Error creating investment. Check the console for details.");
    }
  };

  const filteredCategories = categories.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View
      style={[styles.container, darkMode ? styles.darkMode : styles.lightMode]}
    >
        <View />
      <FlatList
        data={filteredCategories}
        vertical
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text
              style={[
                styles.cardTitle,
                darkMode ? styles.darkCardText : styles.lightCardText,
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.description,
                darkMode ? styles.darkCardText : styles.lightCardText,
              ]}
            >
              {item.description}
            </Text>
            <View style={styles.buto}>
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  darkMode ? styles.darkButton : styles.lightButton,
                ]}
                onPress={() => {
                  setSelectedCategory(item);
                  setJoinModalVisible(true);
                }}
              >
                <Text style={styles.joinButtonText}>Join Group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  darkMode ? styles.darkButton : styles.lightButton,
                ]}
                onPress={() => {
                  setSelectedCategory(item);
                  setPostIdeaModalVisible(true);
                }}
              >
                <Text style={styles.joinButtonText}>Post Idea</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

 

      {/* Modals */}
      <Modal visible={isJoinModalVisible} transparent animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Join {selectedCategory?.title}</Text>
          <Button
            title="Confirm Join"
            onPress={() => handleJoinGroup(selectedCategory.id)}
          />
          <Button
            title="Cancel"
            color="red"
            onPress={() => setJoinModalVisible(false)}
          />
        </View>
      </Modal>
      <Modal visible={isPostIdeaModalVisible} transparent animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Post Your Idea</Text>
          <TextInput
            style={[
              styles.ideaInput,
              darkMode ? styles.darkText : styles.lightText,
            ]}
            placeholder="Enter your idea"
            placeholderTextColor={darkMode ? "#888" : "#666"}
            value={ideaContent}
            onChangeText={setIdeaContent}
            multiline
          />
          <Button title="Post Idea" onPress={handlePostIdea} />
          <Button
            title="Cancel"
            color="red"
            onPress={() => setPostIdeaModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    paddingHorizontal: 10
  },
  image: {
    width: 300,
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative'
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "bold",
    position: 'absolute',
    bottom: 175,
    left: 5,      
    color: '#000', 
    padding: 8    
  },
  
  description: {
    fontSize: 16,
    color: "#666",
    // textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    width: "40%",
    alignItems: "center",
    marginHorizontal: 10,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  ideaInput: {
    width: "80%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    width: "80%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    width: "80%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  joinButtonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalInputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  modalActionContainer: {
    width: "100%",
    alignItems: "center",
  },

  // Specific tweaks for dark mode
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
    display: 'flex',
    flexDirection: 'row'
  }
});
