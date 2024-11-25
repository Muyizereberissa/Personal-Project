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
          "Groups"
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
      navigation.navigate("GroupDetails", {
        groupId: categoryId,
        groupName: selectedCategory.title,
      });
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
        <View>
          <Text> </Text>
        </View>
      <FlatList
        data={filteredCategories}
        vertical
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}
          >
            <Image source={{ uri: item.groupImage }} style={styles.image} />
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
              {item.groupDescription}
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
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  darkMode: {
    backgroundColor: "#121212",
  },
  lightMode: {
    backgroundColor: "#f9f9f9",
  },
  darkText: {
    color: "#e0e0e0",
  },
  lightText: {
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
  },
  lightCard: {
    backgroundColor: "#ffffff",
  },
  darkCardText: {
    color: "#e0e0e0",
  },
  lightCardText: {
    color: "#333",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buto: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    width: "90%",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    width: "80%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    width: "80%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Improved buttons for light/dark themes
  darkButton: {
    backgroundColor: "#4CAF50",
  },
  lightButton: {
    backgroundColor: "#4CAF50",
  },
});
