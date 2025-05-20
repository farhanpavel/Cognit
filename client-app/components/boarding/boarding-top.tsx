import { View, Text, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "react-native-paper";

interface BoardingTopProps {
  shouldHideLogo?: boolean;
}

const BoardingTop: React.FC<BoardingTopProps> = ({
  shouldHideLogo = false
}) => {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={[theme.colors.secondary, theme.colors.tertiary]}
      style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
    >
      <View
        style={{
          height: 250,
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
      >
        <Image
          source={require("@/assets/images/boarding_overlay.png")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: "100%",
            width: "100%",
            opacity: 0.5
          }}
        />
        {!shouldHideLogo && (
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
            style={{ zIndex: 30, transform: [{ scale: 0.75 }] }}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default BoardingTop;
