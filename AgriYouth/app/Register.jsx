import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UseAuth } from "../Context/ContextProvider";
import { FontAwesome } from "@expo/vector-icons"; // Import for Google and Twitter icons

export default function Register() {
  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigation = useNavigation();
  const { register, darkMode } = UseAuth();

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });       
  };

  const handleSubmit = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    const handleRegister = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        try {
          await register(formValues.email, formValues.password);
          navigation.navigate("Login");
        } catch (error) {
          console.log("Error registering user:", error);
        }
      }
    };
    handleRegister();
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
      <Text style={styles.title}>Register</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={25} color="#1E992C" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#999"
          value={formValues.username}
          onChangeText={(value) => handleChange("username", value)}
        />
      </View>
      <Text style={styles.errorMessage}>{formErrors.username}</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={25} color="#1E992C" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#999"
          value={formValues.email}
          onChangeText={(value) => handleChange("email", value)}
        />
      </View>
      <Text style={styles.errorMessage}>{formErrors.email}</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={25} color="#1E992C" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formValues.password}
          onChangeText={(value) => handleChange("password", value)}
        />
      </View>
      <Text style={styles.errorMessage}>{formErrors.password}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create User</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={[styles.dividerText, darkMode ? styles.darkText : styles.lightText]}>
          or register with
        </Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={30} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={30} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="twitter" size={30} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text style={styles.linkText} onPress={() => navigation.navigate("Login")}>
          Login
        </Text>
      </View>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E992C",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginRight: 8,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#1E992C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#999",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  darkText: {
    color: "#ccc",
  },
  lightText: {
    color: "#666",
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30
  },
  socialButton: {
    marginHorizontal: 15,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  loginText: {
    color: "#333",
    fontSize: 20,
  },
  linkText: {
    color: "#1E992C",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 20,
  },
});
