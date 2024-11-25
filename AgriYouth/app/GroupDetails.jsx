import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FIREBASE_DB } from "../FirebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { UseAuth } from "../Context/ContextProvider";

export default function GroupDetails({ route }) {
  const groupId = route?.params?.groupId || " ";
  const groupName = route?.params?.groupName || " ";

  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { currentUser } = UseAuth();
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const membersCollection = query(
          collection(FIREBASE_DB, "JoinedGroups"),
          where("categoryId", "==", groupId)
        );
        const snapshot = await getDocs(membersCollection);
        const membersList = snapshot.docs.map((doc) => doc.data());
        setMembers(membersList);
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  // Listen for real-time updates to messages
  useEffect(() => {
    const messagesCollection = query(
      collection(FIREBASE_DB, "messages", groupId, "chat"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID
        ...doc.data(),
      }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [groupId]);

  // Function to send a message
  const sendMessage = async () => {
    if (message.trim() === "") return;

    if (!currentUser) {
      console.error("No user logged in. Cannot send message.");
      return;
    }

    try {
      await addDoc(collection(FIREBASE_DB, "messages", groupId, "chat"), {
        senderId: currentUser.email,
        message,
        timestamp: Timestamp.now(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Function to delete a message
  const deleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, "messages", groupId, "chat", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Confirm deletion dialog
  const confirmDelete = (messageId, senderId) => {
    if (senderId !== currentUser.email) {
      Alert.alert("Permission Denied", "You can only delete your own messages.");
      return;
    }

    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteMessage(messageId), style: "destructive" },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>{groupName}</Text>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.senderId === currentUser.email
                    ? styles.userMessage
                    : styles.otherMessage,
                ]}
              >
                <Text
                  style={[
                    styles.senderText,
                    item.senderId === currentUser.email
                      ? styles.userSender
                      : styles.otherSender,
                  ]}
                >
                  {item.senderId === currentUser.email ? "You" : item.senderId}
                </Text>
                <Text style={styles.messageText}>{item.message}</Text>
                {/* Delete button for the sender's messages */}
                {item.senderId === currentUser?.email && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDelete(item.id, item.senderId)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              placeholder="Type a message"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1E90FF",
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    maxWidth: "70%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6", // Light green for user messages
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff", // White for others' messages
  },
  senderText: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  userSender: {
    color: "#075E54", // Dark green for user
  },
  otherSender: {
    color: "#333", // Dark gray for others
  },
  messageText: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#FF6347",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 8,
    paddingLeft: 12,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    padding: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});