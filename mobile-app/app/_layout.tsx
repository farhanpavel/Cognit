import { useFonts } from "expo-font";
import { Href, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Text,Button  } from "react-native-paper";
import { Linking, View } from "react-native";
import { Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Card, PaperProvider } from "react-native-paper";
import { theme } from "@/theme/theme";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { handleRemoteMessage } from "@/utils/notification/notification-manager";
import { Platform } from "react-native";
import { useTestMutation } from "@/modules/auth/api/auth.api";
import { useGetMyProfileMutation } from "@/modules/profile/api/profile.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "@/components/ui/loading";
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';


// Detect shakes instead of volume buttons
Accelerometer.addListener(({ x, y, z }) => {
  const acceleration = Math.sqrt(x * x + y * y + z * z);
  if (acceleration > 1.5) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("Voice command activated");
  }
});


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

// Add NotificationPopup component
const NotificationPopup = ({ visible, notification, onClose }: {
  visible: boolean;
  notification: any;
  onClose: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1}
        onPress={onClose}
      >
        <Card style={styles.modalContent}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              {notification?.title || "Notification"}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {notification?.body || ""}
            </Text>
            
            <View style={styles.buttonContainer}>
              {notification?.meetUrl && (
                <Button
                  mode="contained"
                  icon="video"
                  onPress={() => Linking.openURL(notification.meetUrl)}
                  style={styles.button}
                >
                  Join Meet
                </Button>
              )}
              
              {notification?.formUrl && (
                <Button
                  mode="outlined"
                  icon="form-textbox"
                  onPress={() => Linking.openURL(notification.formUrl)}
                  style={styles.button}
                >
                  Open Form
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Modal>
  );
};


export default function RootLayout() {
  const router = useRouter();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [activeNotification, setActiveNotification] = useState<any>(null);

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
  const [popupVisible, setPopupVisible] = useState(false);

    // Modify handleRemoteMessage usage
  const handleMessage = async (remoteMessage: any) => {
    if(remoteMessage.from === "/topics/research"){
      console.log("Handling research notification");
      const notificationData = remoteMessage;
      if (notificationData) {
        setActiveNotification({
          title: notificationData.notification.title,
          body: notificationData.notification.body,
          meetUrl: notificationData.data?.meetUrl,
          formUrl: notificationData.data?.formUrl
        });
      }
    }else {
      console.log("Handling other notification");
    }
  };

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

    messaging()
      .subscribeToTopic("research")
      .then(() => console.log("Subscribed to topic!"));  

    getProfile(null).then((r) => console.log(r));

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      await handleRemoteMessage(remoteMessage);
      await handleMessage(remoteMessage);
    });
    return messaging().onMessage(async (remoteMessage) => {
      await handleRemoteMessage(remoteMessage);
      await handleMessage(remoteMessage);
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
        <NotificationPopup
        visible={!!activeNotification}
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        />
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
          <Stack.Screen name="menu" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="research" options={{ headerShown: false }} />

          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    );
}
// Add styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 20,
  },
  title: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    marginTop: 5,
  },
});
