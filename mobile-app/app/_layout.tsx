import { useFonts } from "expo-font";
import { Href, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/theme/theme";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { handleRemoteMessage } from "@/utils/notification/notification-manager";
import { Platform } from "react-native";
import { useTestMutation } from "@/modules/auth/api/auth.api";
import { useGetMyProfileMutation } from "@/modules/profile/api/profile.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "@/components/ui/loading";

SplashScreen.preventAutoHideAsync().then((r) => {
  console.log("Root layout rendering");
});
let pendingRoute = "";

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("You need to enable notifications in the app settings.");
    return;
  }
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("default", {
      name: "default notifications",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default"
    });
}

export default function RootLayout() {
  const router = useRouter();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [loaded] = useFonts({
    poppins: require("@/assets/fonts/Poppins-Regular.ttf"),
    poppinsBold: require("@/assets/fonts/Poppins-Bold.ttf"),
    poppinsMedium: require("@/assets/fonts/Poppins-Medium.ttf"),
    poppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    poppinsLight: require("@/assets/fonts/Poppins-Light.ttf"),
    poppinsExtraLight: require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    poppinsThin: require("@/assets/fonts/Poppins-Thin.ttf"),
    poppinsItalic: require("@/assets/fonts/Poppins-Italic.ttf"),
    poppinsBoldItalic: require("@/assets/fonts/Poppins-BoldItalic.ttf"),
    poppinsMediumItalic: require("@/assets/fonts/Poppins-MediumItalic.ttf"),
    poppinsSemiBoldItalic: require("@/assets/fonts/Poppins-SemiBoldItalic.ttf"),
    poppinsLightItalic: require("@/assets/fonts/Poppins-LightItalic.ttf"),
    poppinsExtraLightItalic: require("@/assets/fonts/Poppins-ExtraLightItalic.ttf"),
    poppinsThinItalic: require("@/assets/fonts/Poppins-ThinItalic.ttf"),
    poppinsBlack: require("@/assets/fonts/Poppins-Black.ttf"),
    poppinsBlackItalic: require("@/assets/fonts/Poppins-BlackItalic.ttf"),
    poppinsExtraBold: require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    poppinsExtraBoldItalic: require("@/assets/fonts/Poppins-ExtraBoldItalic.ttf")
  });

  const [test, { data, error }] = useTestMutation();
  const [getProfile, { data: profileData, error: profileError }] =
    useGetMyProfileMutation();

  useEffect(() => {
    if (lastNotificationResponse) {
      console.log(lastNotificationResponse);

      //console.log(lastNotificationResponse);
      if (
        lastNotificationResponse.notification.request.identifier !== "default"
      ) {
        console.log(lastNotificationResponse.notification.request.identifier);
        pendingRoute = lastNotificationResponse.notification.request.identifier;
      }
    }
  }, [lastNotificationResponse]);
  useEffect(() => {
    registerForPushNotificationsAsync().then((r) => console.log(r));
    messaging()
      .getToken()
      .then((token) => {
        console.log(token);
      });
    messaging().onTokenRefresh((token) => {
      console.log(token);
    });
    messaging()
      .subscribeToTopic("test")
      .then(() => console.log("Subscribed to topic!"));

    getProfile(null).then((r) => console.log(r));

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      await handleRemoteMessage(remoteMessage);
    });
    return messaging().onMessage(async (remoteMessage) => {
      await handleRemoteMessage(remoteMessage);
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });
  }, []);

  useEffect(() => {
    console.log(data, error);
  }, [data, error]);

  useEffect(() => {
    console.log(profileData, profileError);
    if (loaded && (profileData || profileError)) {
      console.log(pendingRoute);
      if (profileData) {
        AsyncStorage.setItem("userId", profileData.id).then(() => {
          console.log("User id set");
        });
        SplashScreen.hideAsync().then((r) => console.log(r));
        if (pendingRoute) {
          router.push(pendingRoute as Href<string | object>);
        } else {
          router.push("/(tabs)");
        }
      } else {
        SplashScreen.hideAsync().then((r) => console.log(r));
        router.push("/login");
      }
    } else {
      console.log("Not loaded");
    }
  }, [profileData, profileError, loaded]);

  if (!loaded) {
    return <Loading />;
  }

  //notificaation interaction listener
  // Notifications.addNotificationResponseReceivedListener((response) => {
  // if(!loaded) return;
  // console.log("Notification response received", response);
  // if(response.notification.request.identifier!=='default'){
  //   router.push(response.notification.request.identifier)
  // }
  // });
  else
    return (
      <PaperProvider theme={theme} settings={{ rippleEffectEnabled: false }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="physics-sim" options={{ headerShown: false }} />
          <Stack.Screen name="oscillation" options={{ headerShown: false }} />
          <Stack.Screen name="velocity" options={{ headerShown: false }} />
          <Stack.Screen name="light" options={{ headerShown: false }} />
          <Stack.Screen name="graph" options={{ headerShown: false }} />
          <Stack.Screen name="water" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ headerShown: false }} />
          <Stack.Screen name="human" options={{ headerShown: false }} />

          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    );
}
