import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StatusBar, BackHandler, Alert } from "react-native";
import { Image, StyleSheet, Platform, View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import * as Location from "expo-location";
import { useGetMyProfileMutation } from "@/modules/profile/api/profile.api";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetDonorStatsMutation } from "@/modules/donor/api/donor.api";
import Loading from "@/components/ui/loading";
import React from "react";

export interface HomeUserState {
  name: string | null;
  location: string | null;
  donor: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
      <Text>This is good </Text>
    </ScrollView>
  );
}