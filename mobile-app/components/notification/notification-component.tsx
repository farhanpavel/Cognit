import { Button, View } from "react-native";
import { triggerNotification } from "@/utils/notification/notification-manager";

export default function NotificationComponent() {
  return (
    <View className={"p-10"}>
      <Button
        title="Send Local Notification"
        onPress={() =>
          triggerNotification("Hey! 📬", "This is a local notification!")
        }
      />
    </View>
  );
}
