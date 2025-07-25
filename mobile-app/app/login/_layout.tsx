import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  BackHandler
} from "react-native";
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/login/login-form";
import BoardingTops from "@/components/boarding/boarding-top";
import { useLoginMutation } from "@/modules/auth/api/auth.api";
import { useGetMyProfileMutation } from "@/modules/profile/api/profile.api";
import NotificationComponent from "@/components/notification/notification-component";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    
    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      return false; // Let the OS handle the back action (exit app)
    };
    
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      subscription.remove();
    };
  }, []);

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
      {/*<BoardingTops />*/}
      <Image
          className={`content-center items-center self-center ${keyboardVisible?'mt-6':'mt-24'} rounded-full`}
          source={require("@/assets/images/adaptive-icon.png")}
          style={{ height: 150, width: 150 }}
      />
      <LoginForm setKeyboardOpen={setKeyboardVisible} />
      {/*{!keyboardVisible && (*/}
      {/*  <Image*/}
      {/*    source={require("@/assets/images/adaptive-icon.png")}*/}
      {/*    height={50}*/}
      {/*    width={50}*/}
      {/*    className="absolute -bottom-5 -left-10"*/}
      {/*  />*/}
      {/*)}*/}
      
    </View>
  );
};

export default LoginScreen;
