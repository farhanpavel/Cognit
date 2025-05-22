import { View, Text, Keyboard, Image } from "react-native";
import React, { useEffect, useState } from "react";
import BoardingTops from "@/components/boarding/boarding-top";
import RegisterForm from "@/components/register/register-form";

const RegisterScreen = () => {
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
         {/*<BoardingTops />*/}
         <Image
             className={`content-center items-center self-center ${keyboardVisible?'mt-6':'mt-24'} rounded-full`}
             source={require("@/assets/images/adaptive-icon.png")}
             style={{ height: 150, width: 150 }}
         />
      <RegisterForm setKeyboardOpen={setKeyboardVisible} />
      {/*!keyboardVisible && (
        <Image
          source={require("@/assets/images/lifeline_logo.png")}
          height={50}
          width={50}
          className="absolute -bottom-5 -left-10"
        />
      )*/}
    </View>
  );
};

export default RegisterScreen;
