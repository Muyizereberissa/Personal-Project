import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UseAuth } from '../Context/ContextProvider';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Profile() {
  const { darkMode } = UseAuth();
  const [profileImage, setProfileImage] = useState(null);

  // Function to handle image selection
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("Image picker error: ", response.errorMessage);
      } else if (response.assets) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={selectImage}>
          <Image
            source={profileImage ? { uri: profileImage } : { uri: "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
          <Icon name="camera-plus" size={30} color="#1E992C" style={styles.cameraIcon} />
        </TouchableOpacity>
        <Text style={[styles.name, darkMode ? styles.darkText : styles.lightText]}>Berissa Muyizere</Text>
        <Text style={[styles.bio, darkMode ? styles.darkText : styles.lightText]}>
          Software Engineer | Tech Enthusiast | Lifelong Learner
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, darkMode ? styles.darkText : styles.lightText]}>Followers</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>1,204</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, darkMode ? styles.darkText : styles.lightText]}>Following</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>180</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, darkMode ? styles.darkText : styles.lightText]}>Projects</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>12</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="account-edit" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="message-text" size={20} color="#fff" />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aboutContainer}>
        <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText]}>About</Text>
        <Text style={[styles.aboutText, darkMode ? styles.darkText : styles.lightText]}>
          Hi, I'm Berissa! I'm passionate about using technology to solve real-world problems mainly agriculture, education, and unemployment related problems.
        </Text>
      </View>

      <View style={styles.skillsContainer}>
        <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText]}>Skills</Text>
        <View style={styles.skillsList}>
          <View style={styles.skill}>
            <Icon name="code-tags" size={20} color="#1E992C" />
            <Text style={[styles.skillText, darkMode ? styles.darkText : styles.lightText]}>JavaScript</Text>
          </View>
          <View style={styles.skill}>
            <Icon name="language-html5" size={20} color="#1E992C" />
            <Text style={[styles.skillText, darkMode ? styles.darkText : styles.lightText]}>HTML & CSS</Text>
          </View>
          <View style={styles.skill}>
            <Icon name="react" size={20} color="#1E992C" />
            <Text style={[styles.skillText, darkMode ? styles.darkText : styles.lightText]}>React Native</Text>
          </View>
          <View style={styles.skill}>
            <Icon name="database" size={20} color="#1E992C" />
            <Text style={[styles.skillText, darkMode ? styles.darkText : styles.lightText]}>Firebase</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
  },
  darkContainer: {
    backgroundColor: "#000",
  },
  lightContainer: {
    backgroundColor: "#f2f2f2",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  infoBox: {
    alignItems: "center",
    padding: 10,
  },
  infoTitle: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E992C",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E992C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  aboutContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    textAlign: "justify",
  },
  skillsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  skill: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#e8f5e9",
  },
  skillText: {
    fontSize: 16,
    marginLeft: 5,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#333",
  },
});
