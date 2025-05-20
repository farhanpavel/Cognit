import React from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { View } from "react-native";
import { theme } from "@/theme/theme";

const Loading = () => {
  const colors = theme.colors;
  return (
    <View className="flex-1 flex items-center justify-center">
      <ActivityIndicator color={colors.primary} size="large" />
      <Text
        variant="bodySmall"
        className="text-center mt-5"
        style={{ color: colors.primary }}
      >
        Getting Data
      </Text>
    </View>
  );
};

export default Loading;
