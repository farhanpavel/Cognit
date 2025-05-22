import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Button, Text, useTheme } from "react-native-paper";
import { ScrollView, StatusBar } from "react-native";
import CustomButton from "@/components/ui/button";
import React from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all stored data
      router.push("/login"); // Navigate to the login screen
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ScrollView
      className="flex flex-1"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="always"
    >
      <StatusBar backgroundColor={colors.tertiary} />
      <Text>This is good</Text>
      <Button mode="contained" onPress={handleLogout} style={{ margin: 16 }}>
        Logout
      </Button>

      <CustomButton onPress={() => router.push("/velocity")}>
        Physics Simulation
      </CustomButton>
    </ScrollView>
  );
}
