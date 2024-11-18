import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet } from "react-native";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";

export default function PostedIdeas({ darkMode }) {
  const [ideas, setIdeas] = useState([]); // State for posted ideas
  const [investmentAmount, setInvestmentAmount] = useState(""); // State to track the investment amount
  const [isInvestModalVisible, setInvestModalVisible] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null); // Selected idea for investment

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
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

    fetchIdeas();
  }, []);

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

  return (
    <View>
      <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
        Posted Ideas
      </Text>
      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
            <Text
              style={[
                styles.cardTitle,
                darkMode ? styles.darkCardText : styles.lightCardText,
              ]}
            >
              {item.content}
            </Text>
            <TouchableOpacity
              style={[
                styles.joinButton,
                darkMode ? styles.darkButton : styles.lightButton,
              ]}
              onPress={() => {
                setSelectedIdea(item);
                setInvestModalVisible(true);
              }}
            >
              <Text style={styles.joinButtonText}>Invest</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* Modal for Investment */}
      <Modal visible={isInvestModalVisible} transparent animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Invest in Idea</Text>
          <TextInput
            style={[
              styles.ideaInput,
              darkMode ? styles.darkText : styles.lightText,
            ]}
            placeholder="Enter investment amount"
            placeholderTextColor={darkMode ? "#888" : "#666"}
            value={investmentAmount}
            onChangeText={setInvestmentAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleCreateInvestment(selectedIdea.id)}
          >
            <Text style={styles.modalButtonText}>Invest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setInvestModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
    },
    darkText: {
      color: "#FFF",
    },
    lightText: {
      color: "#000",
    },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
      marginVertical: 10,
      borderRadius: 10,
      marginHorizontal: 20,
      alignItems: "center",
    },
    darkCard: {
      backgroundColor: "#333",
    },
    lightCard: {
      backgroundColor: "#FFF",
      borderColor: "#ddd",
      borderWidth: 1,
    },
    cardTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
    },
    darkCardText: {
      color: "#FFF",
    },
    lightCardText: {
      color: "#000",
    },
    joinButton: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    darkButton: {
      backgroundColor: "#4CAF50", // Green for dark mode
    },
    lightButton: {
      backgroundColor: "#2196F3", // Blue for light mode
    },
    joinButtonText: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "500",
    },
    modalView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#FFF",
    },
    ideaInput: {
      width: "80%",
      padding: 10,
      borderRadius: 5,
      backgroundColor: "#FFF",
      marginBottom: 20,
      color: "#000",
    },
    modalButton: {
      backgroundColor: "#4CAF50",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 5,
      marginBottom: 10,
    },
    modalButtonText: {
      color: "#FFF",
      fontSize: 16,
      textAlign: "center",
    },
    cancelButton: {
      backgroundColor: "#FF5733",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 5,
    },
    cancelButtonText: {
      color: "#FFF",
      fontSize: 16,
      textAlign: "center",
    },
  });
  
