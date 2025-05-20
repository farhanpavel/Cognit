import { View, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { Divider, Text, TextInput, useTheme } from "react-native-paper";
import CustomButton from "../ui/button";
import { useRouter } from "expo-router";
import { useLoginMutation } from "@/modules/auth/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useGetMyProfileMutation} from "@/modules/profile/api/profile.api";

interface LoginFormProps {
  setKeyboardOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm = (props: LoginFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const theme = useTheme();
  const router = useRouter();

  const [login, {isLoading}] = useLoginMutation();
  //const [getProfile] = useGetMyProfileMutation();

  const loginUser = async () => {
    // Basic validation
    if (email === "" || password === "") {
      setErrorMessage("Please fill all fields");
      return;
    }
    if (!email.includes("@")) {
      setErrorMessage("Invalid email");
      return;
    }

    try {
      // Execute login mutation
      const loginResponse = await login({ email, password }).unwrap();

      // Store tokens
      await AsyncStorage.setItem("accessToken", loginResponse.accessToken);
      await AsyncStorage.setItem("refreshToken", loginResponse.refreshToken);

      router.push("/(tabs)");


      // Check if profile exists
      // try {
      //   const profileResponse = await getProfile(null).unwrap();
      //   if (profileResponse?.id) {
      //     router.push("/(tabs)");
      //   } else {
      //
      //   }
      // } catch (profileError) {
      //   console.error('Profile fetch error:', profileError);
      //
      // }
    } catch (loginError: any) {
      console.error('Login error:', loginError);
      setErrorMessage(
          loginError.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
      <View className="px-5 mt-10">
        <Text variant="titleLarge" className="text-center">
          Login
        </Text>
        <View className="mt-5">
          <TextInput
              value={email}
              placeholder="E-mail"
              mode="outlined"
              outlineColor={theme.colors.primary}
              onPressIn={() => props.setKeyboardOpen?.(true)}
              onChangeText={setEmail}
              autoCapitalize="none"
          />
          <TextInput
              value={password}
              mode="outlined"
              className="mt-3"
              placeholder="Password"
              outlineColor={theme.colors.primary}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              onPressIn={() => props.setKeyboardOpen?.(true)}
              autoCapitalize="none"
              right={
                <TextInput.Icon
                    icon={showPass ? "eye-off" : "eye"}
                    onPress={() => setShowPass(!showPass)}
                />
              }
          />
        </View>

        <CustomButton className="mt-5" onPress={loginUser} loading={isLoading}>
          Sign In
        </CustomButton>

        {errorMessage && (
            <View className="rounded-md p-3 bg-red-200 mt-3">
              <Text className="text-red-500 font-medium">{errorMessage}</Text>
            </View>
        )}

        <View className="flex items-center">
          <Divider bold className="my-5 w-[200px]" />
          <View className="flex flex-row items-center gap-2">
            <Text variant="bodySmall">Don't have an Account?</Text>
            <Text
                onPress={() => router.push("/register")}
                variant="bodySmall"
                style={{ color: theme.colors.primary }}
            >
              Register
            </Text>
          </View>
        </View>
      </View>
  );
};

export default LoginForm;