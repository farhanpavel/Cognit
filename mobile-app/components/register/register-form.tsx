"use client";

import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Divider, Text, TextInput, useTheme } from "react-native-paper";
import CustomButton from "../ui/button";
import { useRouter } from "expo-router";
import { useLoginMutation, useRegisterMutation } from "@/modules/auth/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RegisterFormProps {
  setKeyboardOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterForm = (props: RegisterFormProps) => {
  // State management
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [nameFocused, setNameFocused] = useState<boolean>(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const theme = useTheme();
  const router = useRouter();
  const { width } = Dimensions.get("window");

  const [register, { isLoading }] = useRegisterMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();

  // Custom theme colors
  const primaryColor = "#20B486";
  const secondaryColor = "#E8F8F3";
  const errorColor = "#FF5A5A";

  // Animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Shake animation for error
  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateEmail = (email: string) => {
  // Updated email validation with proper domain handling
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const registerUser = async () => {
    // Reset error message
    setErrorMessage("");

    // Basic validation
    if (!name || !email || !password) {
      setErrorMessage("Please fill all fields");
      shakeError();
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      shakeError();
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters");
      shakeError();
      return;
    }

    try {
      // Execute registration mutation
      // In your registrationData object:
const registrationData = {
  name: name.trim(),
  email: email.trim(),
  password: password.trim(),
  role,
};
      const response = await register(registrationData).unwrap();

      if(response){
        // Login after registration
        console.log("Registration response:", response);
        router.push("/login");
      }
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMessage(
        error.data?.message || "Registration failed. Please try again."
      );
      shakeError();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { translateX: shakeAnim }],
        }}
        className="px-5 mt-6 flex-1"
      >
        {/* Header */}
        <View className="items-center mb-6">
          <Text
            variant="headlineMedium"
            className="font-bold text-center"
            style={{ color: primaryColor }}
          >
            Create Account
          </Text>
          <Text variant="bodyMedium" className="text-center mt-2 opacity-70">
            Start your learning journey
          </Text>
        </View>

        {/* Form Fields */}
        <View className="mt-2 bg-white rounded-xl p-4 shadow-sm">
          {/* Name Field */}
          <View className="mb-4">
            <TextInput
              value={name}
              placeholder="Full Name"
              mode="outlined"
              outlineColor={nameFocused ? primaryColor : "#E0E0E0"}
              activeOutlineColor={primaryColor}
              onFocus={() => {
                props.setKeyboardOpen?.(true);
                setNameFocused(true);
              }}
              onBlur={() => setNameFocused(false)}
              onChangeText={setName}
              autoCapitalize="words"
              left={
                <TextInput.Icon
                  icon="account-outline"
                  color={nameFocused ? primaryColor : undefined}
                />
              }
              style={{
                backgroundColor: nameFocused ? secondaryColor : "white",
              }}
              className="rounded-lg"
            />
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <TextInput
              value={email}
              placeholder="Email Address"
              mode="outlined"
              outlineColor={emailFocused ? primaryColor : "#E0E0E0"}
              activeOutlineColor={primaryColor}
              onFocus={() => {
                props.setKeyboardOpen?.(true);
                setEmailFocused(true);
              }}
              onBlur={() => setEmailFocused(false)}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              left={
                <TextInput.Icon
                  icon="email-outline"
                  color={emailFocused ? primaryColor : undefined}
                />
              }
              style={{
                backgroundColor: emailFocused ? secondaryColor : "white",
              }}
              className="rounded-lg"
            />
          </View>

          {/* Password Field */}
          <View className="mb-4">
            <TextInput
              value={password}
              mode="outlined"
              placeholder="Password"
              outlineColor={passwordFocused ? primaryColor : "#E0E0E0"}
              activeOutlineColor={primaryColor}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              onFocus={() => {
                props.setKeyboardOpen?.(true);
                setPasswordFocused(true);
              }}
              onBlur={() => setPasswordFocused(false)}
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon="lock-outline"
                  color={passwordFocused ? primaryColor : undefined}
                />
              }
              right={
                <TextInput.Icon
                  icon={showPass ? "eye-off" : "eye"}
                  onPress={() => setShowPass(!showPass)}
                  color={passwordFocused ? primaryColor : undefined}
                />
              }
              style={{
                backgroundColor: passwordFocused ? secondaryColor : "white",
              }}
              className="rounded-lg"
            />
          </View>

        </View>

        {/* Error Message */}
        {errorMessage && (
          <View className="rounded-xl p-3 bg-red-100 mt-4 flex-row items-center">
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color={errorColor}
            />
            <Text className="text-red-600 font-medium ml-2">
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Register Button */}
        <CustomButton
          className="mt-6 rounded-xl py-1"
          onPress={registerUser}
          loading={isLoading}
          contentStyle={{ paddingVertical: 8 }}
        >
          <Text className="font-bold text-white text-base">Create Account</Text>
        </CustomButton>

        {/* Login Link */}
        <View className="flex items-center mt-4 mb-4">
          <View className="flex flex-row items-center">
            <Text variant="bodyMedium" className="text-gray-600">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text
                variant="bodyMedium"
                className="font-bold ml-2"
                style={{ color: primaryColor }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default RegisterForm;