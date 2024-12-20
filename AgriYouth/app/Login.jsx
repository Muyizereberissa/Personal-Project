import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UseAuth } from "../Context/ContextProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import icon library

export default function Login() {
  const initialValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigation = useNavigation();
  const { login, darkMode } = UseAuth();

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    const handleLogin = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        try {
          await login(formValues.email, formValues.password);
          navigation.navigate("BottomTabs");
        } catch (error) {
          console.error("Login error", error);
        }
      }
    };
    handleLogin();
  }, [formErrors, isSubmit]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be greater than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password must not be greater than 10 characters";
    }
    return errors;
  };

  return (
    <View style={[styles.container, darkMode ? styles.dark : styles.light]}>
      <Text style={styles.title}>Log in</Text>

      <View style={styles.inputWrapper}>
        <Icon
          name="email-outline"
          size={25}
          color="#1E992C"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { color: darkMode ? "#fff" : "#333" }]}
          placeholder="Enter email"
          value={formValues.email}
          onChangeText={(value) => handleChange("email", value)}
          placeholderTextColor={darkMode ? "#aaa" : "#777"}
        />
      </View>
      {formErrors.email && (
        <Text style={styles.errorText}>{formErrors.email}</Text>
      )}

      <View style={styles.inputWrapper}>
        <Icon
          name="lock-outline"
          size={25}
          color="#1E992C"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { color: darkMode ? "#fff" : "#333" }]}
          placeholder="Password"
          secureTextEntry
          value={formValues.password}
          onChangeText={(value) => handleChange("password", value)}
          placeholderTextColor={darkMode ? "#aaa" : "#777"}
        />
      </View>
      {formErrors.password && (
        <Text style={styles.errorText}>{formErrors.password}</Text>
      )}

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View />
      <Text style={styles.orText}>Or log in with</Text>
      <View />
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon name="google" size={30} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon name="facebook" size={30} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon name="twitter" size={30} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1E992C",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#1E992C",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1E992C",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 10,
    marginTop: -5,
  },
  linkText: {
    color: "#1E992C",
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  signupText: {
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    color: "#555",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  dark: {
    backgroundColor: "#333",
  },
  light: {
    backgroundColor: "#fff",
  },
});
