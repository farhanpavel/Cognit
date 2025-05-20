import * as Notifications from "expo-notifications";
import { calculateDistance } from "@/utils/location/distance-calculator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const triggerNotification = async (
  title: string,
  body: string,
  route?: string
) => {
  await Notifications.scheduleNotificationAsync({
    identifier: route ? route : "default",
    content: {
      title: title,
      body: body,
      sound: true,
      vibrate: [0, 250, 250, 250],
      priority: Notifications.AndroidNotificationPriority.MAX
    },
    trigger: { channelId: "default", seconds: 1 }
  });
};

export const handleRemoteMessage = async (remoteMessage: any) => {
  console.log("handling notification", remoteMessage);
  console.log(remoteMessage.data);
  console.log(remoteMessage.from);

  // topic: test
  if (remoteMessage.from === "/topics/test") {
    if (remoteMessage.data.test)
      await triggerNotification(
        remoteMessage.data.test,
        remoteMessage.data.test
      );
    else if (remoteMessage.notification.title)
      await triggerNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
  }

  // topic: blood-request
  if (remoteMessage.from === "/topics/blood-request") {
    const limit = 30; // 10 km
    if (remoteMessage.data) {
      const bloodRequest = JSON.parse(remoteMessage.data.bloodRequest);

      // check if own created blood request
      const userId = await AsyncStorage.getItem("userId");
      const bloodGroupName = await AsyncStorage.getItem("bloodGroupName");
      if (!bloodGroupName) return;
      if (bloodRequest.patientProfile.bloodGroupName !== bloodGroupName) return;
      if (bloodRequest.patientProfile.managedByUserId === userId) return;
      const userLocation = {
        latitude: 23.7260179,
        longitude: 90.3950395
      };
      const hospitalLocation = {
        latitude: bloodRequest.hospitalLocation.latitude,
        longitude: bloodRequest.hospitalLocation.longitude
      };
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        hospitalLocation.latitude,
        hospitalLocation.longitude
      );
      if (distance <= limit) {
        const title = "New Blood Request!";
        const body = `${bloodRequest.patientProfile.name} needs blood of ${bloodRequest.patientProfile.bloodGroupName} at ${bloodRequest.hospitalName}`;
        await triggerNotification(
          title,
          body,
          `/donor-blood-request?bloodRequestId=${bloodRequest.id}`
        );
      }
    }
  }

  // topic: blood-request-<bloodRequestId>
  if (remoteMessage.from.includes("blood-request-")) {
    if (remoteMessage.data) {
      const title = remoteMessage.data.title;
      const body = remoteMessage.data.message;
      await triggerNotification(title, body, `/client-blood-request?requestId=${remoteMessage.data.bloodRequestId}`);
    }
  }
};
