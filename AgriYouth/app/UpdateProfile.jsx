import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UseAuth } from "../Context/ContextProvider";

export default function UpdateProfile() {
  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigation = useNavigation();
  const { currentUser, darkMode, updateEmail, updatePassword } = UseAuth();

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    const handleUpdate = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        try {
          if (formValues.email !== currentUser.email) {
            await updateEmail(formValues.email);
          }
          if (formValues.password) {
            await updatePassword(formValues.password);
          }
          navigation.navigate("Profile");
        } catch (error) {
          console.error("Failed to update profile", error);
        }
      }
    };
    handleUpdate();
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed 10 characters";
    }
    return errors;
  };

  return (
    <View style={[styles.container, darkMode ? styles.dark : styles.light]}>
      <Text style={styles.heading}>Update Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={formValues.username}
        onChangeText={(value) => handleChange("username", value)}
      />
      {formErrors.username && <Text style={styles.error}>{formErrors.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={formValues.email}
        keyboardType="email-address"
        onChangeText={(value) => handleChange("email", value)}
      />
      {formErrors.email && <Text style={styles.error}>{formErrors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={formValues.password}
        secureTextEntry
        onChangeText={(value) => handleChange("password", value)}
      />
      {formErrors.password && <Text style={styles.error}>{formErrors.password}</Text>}

      <Button title="Update" onPress={handleSubmit} />
      
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  dark: {
    backgroundColor: "#333",
  },
  light: {
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  cancel: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
  },
});
