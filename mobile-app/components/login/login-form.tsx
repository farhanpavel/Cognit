"use client";

import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView
} from "react-native";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Divider, Text, TextInput, useTheme } from "react-native-paper";
import CustomButton from "../ui/button";
import { useRouter } from "expo-router";
import { useLoginMutation } from "@/modules/auth/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface LoginFormProps {
  setKeyboardOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm = (props: LoginFormProps) => {
  // State management
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const theme = useTheme();
  const router = useRouter();
  const { width } = Dimensions.get("window");

  const [login, { isLoading }] = useLoginMutation();

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
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  // Shake animation for error
  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const loginUser = async () => {
    // Reset error message
    setErrorMessage("");

    // Basic validation
    if (email === "" || password === "") {
      setErrorMessage("Please fill all fields");
      shakeError();
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      shakeError();
      return;
    }

    try {
      // Execute login mutation
      const loginResponse = await login({ email, password }).unwrap();

      // Store tokens
      await AsyncStorage.setItem("accessToken", loginResponse.accessToken);
      await AsyncStorage.setItem("refreshToken", loginResponse.refreshToken);

      router.push("/(tabs)");
    } catch (loginError: any) {
      console.error("Login error:", loginError);
      setErrorMessage(
        loginError.data?.message ||
          "Login failed. Please check your credentials."
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
          transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
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
            Welcome Back
          </Text>
          <Text variant="bodyMedium" className="text-center mt-2 opacity-70">
            Continue your learning journey
          </Text>
        </View>

        {/* Form Fields */}
        <View className="mt-2 bg-white rounded-xl p-4 shadow-sm">
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
                backgroundColor: emailFocused ? secondaryColor : "white"
              }}
              className="rounded-lg"
            />
          </View>

          <View className="mb-2">
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
                backgroundColor: passwordFocused ? secondaryColor : "white"
              }}
              className="rounded-lg"
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push("/forgot-password")}
            className="self-end mb-4"
          >
            <Text
              variant="bodySmall"
              style={{ color: primaryColor }}
              className="font-medium"
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
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

        {/* Login Button */}
        <CustomButton
          className="mt-6 rounded-xl py-1"
          onPress={loginUser}
          loading={isLoading}
          contentStyle={{ paddingVertical: 8 }}
        >
          <Text className="font-bold text-white text-base">Sign In</Text>
        </CustomButton>

        {/* Social Login Options - Compact Version */}
        <View className="mt-4 items-center">
          <View className="flex-row items-center w-full mb-4">
            <Divider style={{ flex: 1, height: 1 }} />
            <Text className="mx-3 text-gray-500 text-sm">or continue with</Text>
            <Divider style={{ flex: 1, height: 1 }} />
          </View>

          <View className="flex-row justify-center space-x-4 w-full">
            <TouchableOpacity
              className="items-center justify-center w-12 h-12 rounded-full bg-gray-100"
              onPress={() => console.log("Google login")}
            >
              <MaterialCommunityIcons name="google" size={20} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center w-12 h-12 rounded-full bg-gray-100"
              onPress={() => console.log("Apple login")}
            >
              <MaterialCommunityIcons name="apple" size={20} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center w-12 h-12 rounded-full bg-gray-100"
              onPress={() => console.log("Facebook login")}
            >
              <MaterialCommunityIcons
                name="facebook"
                size={20}
                color="#4267B2"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Link */}
        <View className="flex items-center mt-4 mb-4">
          <View className="flex flex-row items-center">
            <Text variant="bodyMedium" className="text-gray-600">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text
                variant="bodyMedium"
                className="font-bold ml-2"
                style={{ color: primaryColor }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default LoginForm;
