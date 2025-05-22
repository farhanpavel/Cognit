"use client";

import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView
} from "react-native";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Divider, Text, TextInput, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import CustomButton from "../ui/button";
import { useRegisterMutation } from "@/modules/auth/api/auth.api";
import type { AuthCredentials } from "@/modules/auth/models/auth.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetMyProfileMutation } from "@/modules/profile/api/profile.api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getAuth } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RegisterFormProps {
  setKeyboardOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterForm = (props: RegisterFormProps) => {
  // API hooks
  const [register, { data, isLoading, error: registrationError }] =
    useRegisterMutation();
  const [
    getProfile,
    { data: profileData, isLoading: profileLoading, error: profileError }
  ] = useGetMyProfileMutation();

  // Form state
  const [email, setEmail] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Focus states
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] =
    useState<boolean>(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollIndicatorAnim = useRef(new Animated.Value(1)).current;

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordFeedback, setPasswordFeedback] = useState<string>("");

  // Scroll state
  const [showScrollIndicator, setShowScrollIndicator] = useState<boolean>(true);
  const [isNearBottom, setIsNearBottom] = useState<boolean>(false);

  const theme = useTheme();
  const router = useRouter();
  const f_auth = getAuth();
  const { width, height } = Dimensions.get("window");

  // Custom theme colors
  const primaryColor = "#20B486";
  const secondaryColor = "#E8F8F3";
  const errorColor = "#FF5A5A";
  const weakPasswordColor = "#FF9800";
  const mediumPasswordColor = "#FFC107";
  const strongPasswordColor = "#4CAF50";

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

    // Auto-hide scroll indicator after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(scrollIndicatorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => setShowScrollIndicator(false));
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Redirect after successful registration
  useEffect(() => {
    if (data) {
      router.push("/create-profile");
    }
  }, [data]);

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

  // Handle scroll events
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    setIsNearBottom(isCloseToBottom);

    // Show scroll indicator when user starts scrolling
    if (contentOffset.y > 50 && !showScrollIndicator && !isCloseToBottom) {
      setShowScrollIndicator(true);
      Animated.timing(scrollIndicatorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  };

  // Password strength checker (simplified)
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }

    let strength = 0;
    let feedback = "";

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 1) feedback = "Weak";
    else if (strength === 2) feedback = "Medium";
    else feedback = "Strong";

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);

    Animated.timing(progressAnim, {
      toValue: strength / 4,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Register user with email/password
  const registerUser = async () => {
    if (email === "" || password === "" || passwordConfirm === "") {
      setErrorMessage("Please fill all fields");
      shakeError();
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      shakeError();
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match");
      shakeError();
      return;
    }

    if (passwordStrength < 2) {
      setErrorMessage("Please use a stronger password");
      shakeError();
      return;
    }

    setErrorMessage("");
    try {
      const credentials: AuthCredentials = { email, password };
      f_auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          const user = await userCredential.user;
          const token = await user.getIdToken();
          AsyncStorage.setItem("accessToken", token);
          router.push("/create-profile");
        })
        .catch((error) => {
          if (error.message) setErrorMessage(error.message);
          else setErrorMessage("Unknown error occurred");
          shakeError();
        });
    } catch (err) {
      setErrorMessage("Registration failed");
      shakeError();
    }
  };

  // Google sign-in handler
  const onGoogleButtonClick = async () => {
    setGoogleLoading(true);
    const f_auth = getAuth();

    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      });

      const googleSignInResult: any = await GoogleSignin.signIn()
        .then((result) => {
          if (result.data === null) {
            setGoogleLoading(false);
            return;
          }
          return result;
        })
        .catch((error) => {
          console.log(error);
          return;
        });

      const googleCredential = auth.GoogleAuthProvider.credential(
        googleSignInResult?.data?.idToken ?? null
      );

      await f_auth
        .signInWithCredential(googleCredential)
        .then(async (userCredential) => {
          const token = await userCredential.user.getIdToken();
          await AsyncStorage.setItem("accessToken", token);
          const profile = await getProfile(null);

          if (profile.data?.id) {
            router.push("/(tabs)");
          } else {
            router.push("/create-profile");
          }
        });
    } catch (err) {
      console.log(err);
      setErrorMessage("Google sign-in failed");
      shakeError();
    } finally {
      setGoogleLoading(false);
    }
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "#E0E0E0";
    if (passwordStrength <= 1) return weakPasswordColor;
    if (passwordStrength === 2) return mediumPasswordColor;
    return strongPasswordColor;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
          }}
          className="px-5 mt-4"
        >
          {/* Header - Compact */}
          <View className="items-center mb-4">
            <Text
              variant="headlineMedium"
              className="font-bold text-center"
              style={{ color: primaryColor }}
            >
              Create Account
            </Text>
            <Text variant="bodySmall" className="text-center mt-1 opacity-70">
              Join to start your learning journey
            </Text>
          </View>

          {/* Form Fields - Compact */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            {/* Email Field */}
            <View className="mb-3">
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

            {/* Password Field */}
            <View className="mb-2">
              <TextInput
                value={password}
                mode="outlined"
                placeholder="Password"
                outlineColor={passwordFocused ? primaryColor : "#E0E0E0"}
                activeOutlineColor={primaryColor}
                onChangeText={(text) => {
                  setPassword(text);
                  checkPasswordStrength(text);
                }}
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

              {/* Compact Password Strength Indicator */}
              {password.length > 0 && (
                <View className="mt-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden mr-2">
                      <Animated.View
                        className="h-full"
                        style={{
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"]
                          }),
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      />
                    </View>
                    <Text
                      variant="bodySmall"
                      style={{
                        color: getPasswordStrengthColor(),
                        fontSize: 12
                      }}
                    >
                      {passwordFeedback}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Confirm Password Field */}
            <View className="mb-2">
              <TextInput
                value={passwordConfirm}
                mode="outlined"
                placeholder="Confirm Password"
                outlineColor={confirmPasswordFocused ? primaryColor : "#E0E0E0"}
                activeOutlineColor={primaryColor}
                onChangeText={setPasswordConfirm}
                secureTextEntry={!showPass}
                onFocus={() => {
                  props.setKeyboardOpen?.(true);
                  setConfirmPasswordFocused(true);
                }}
                onBlur={() => setConfirmPasswordFocused(false)}
                autoCapitalize="none"
                left={
                  <TextInput.Icon
                    icon="lock-check-outline"
                    color={confirmPasswordFocused ? primaryColor : undefined}
                  />
                }
                style={{
                  backgroundColor: confirmPasswordFocused
                    ? secondaryColor
                    : "white"
                }}
                className="rounded-lg"
              />

              {/* Compact Password Match Indicator */}
              {passwordConfirm.length > 0 && (
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name={
                      password === passwordConfirm
                        ? "check-circle"
                        : "alert-circle"
                    }
                    size={14}
                    color={
                      password === passwordConfirm
                        ? strongPasswordColor
                        : errorColor
                    }
                  />
                  <Text
                    variant="bodySmall"
                    className="ml-1"
                    style={{
                      color:
                        password === passwordConfirm
                          ? strongPasswordColor
                          : errorColor,
                      fontSize: 12
                    }}
                  >
                    {password === passwordConfirm ? "Match" : "Don't match"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Error Message */}
          {errorMessage && (
            <View className="rounded-xl p-3 bg-red-100 mt-3 flex-row items-center">
              <MaterialCommunityIcons
                name="alert-circle"
                size={18}
                color={errorColor}
              />
              <Text className="text-red-600 font-medium ml-2 text-sm">
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Register Button */}
          <CustomButton
            className="mt-4 rounded-xl py-1"
            onPress={registerUser}
            loading={isLoading}
            contentStyle={{ paddingVertical: 6 }}
          >
            <Text className="font-bold text-white text-base">
              Create Account
            </Text>
          </CustomButton>

          {/* Social Login Divider - Compact */}
          <View className="mt-4 items-center">
            <View className="flex-row items-center w-full mb-3">
              <Divider style={{ flex: 1, height: 1 }} />
              <Text className="mx-3 text-gray-500 text-sm">or</Text>
              <Divider style={{ flex: 1, height: 1 }} />
            </View>
          </View>

          {/* Google Sign In Button - Compact */}
          <CustomButton
            className="rounded-xl"
            mode="outlined"
            onPress={onGoogleButtonClick}
            loading={googleLoading}
            contentStyle={{ paddingVertical: 6 }}
          >
            <Image
              source={require("@/assets/images/google_ic.png")}
              style={{ width: 18, height: 18 }}
            />
            <Text className="ml-2 font-medium text-sm">
              Sign up with Google
            </Text>
          </CustomButton>

          {/* Login Link */}
          <View className="flex items-center mt-4 mb-2">
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

          {/* Terms and Privacy - Compact */}
          <View className="mb-4">
            <Text
              variant="bodySmall"
              className="text-center text-gray-500 text-xs leading-4"
            >
              By creating an account, you agree to our{" "}
              <Text
                style={{ color: primaryColor }}
                onPress={() => console.log("Terms")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={{ color: primaryColor }}
                onPress={() => console.log("Privacy")}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Scroll Indicator */}
      {/* {showScrollIndicator && !isNearBottom && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            opacity: scrollIndicatorAnim,
            zIndex: 1000
          }}
        >
          <View className="bg-black bg-opacity-60 rounded-full p-2 flex-row items-center">
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color="white"
            />
            <Text className="text-white text-xs ml-1">Scroll for more</Text>
          </View>
        </Animated.View>
      )} */}
    </View>
  );
};

export default RegisterForm;
