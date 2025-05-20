import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from "react-native";
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/login/login-form";
import BoardingTops from "@/components/boarding/boarding-top";
import { useLoginMutation } from "@/modules/auth/api/auth.api";
import { useGetMyProfileMutation } from "@/modules/profile/api/profile.api";
import NotificationComponent from "@/components/notification/notification-component";

const LoginScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <View className="flex flex-1">
      <BoardingTops />
      <LoginForm setKeyboardOpen={setKeyboardVisible} />
      {!keyboardVisible && (
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          height={50}
          width={50}
          className="absolute -bottom-5 -left-10"
        />
      )}
      
    </View>
  );
};

export default LoginScreen;
