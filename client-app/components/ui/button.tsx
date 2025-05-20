import { View } from "react-native";
import React from "react";
import {
  ActivityIndicator,
  ButtonProps,
  Text
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/theme/theme";
import { TouchableOpacity } from "react-native";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  textColor?: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

const CustomButton = (props: CustomButtonProps) => {
  if (props.disabled === undefined) props.disabled = false;

  const getBackgroundColor = () => {
    if (props.disabled) return "#c5c5c5";
    if (props.mode === "outlined") return "transparent";
    return theme.colors.primary;
  };

  const getBorderColor = () => {
    if (props.disabled) return "#c5c5c5";
    return theme.colors.primary;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (props.disabled === true) {
          return;
        }
        props.onPress && props.onPress();
      }}
      className={`mt-4 w-full flex-row items-center justify-center rounded-md ${props.className}`}
      style={{
        backgroundColor: getBackgroundColor(),
        borderWidth: props.mode === "outlined" ? 1 : 0,
        borderColor: getBorderColor()
      }}
    >
      {props.loading && (
        <ActivityIndicator size={20} className={"mr-3"} color={
          props.mode === "outlined" ? theme.colors.primary : "#FFFFFF"
        } />
      )}
      {props.iconName && (
        <View className="pr-1">
          <MaterialCommunityIcons
            name={props.iconName}
            size={18}
            color={props.textColor ? props.textColor : theme.colors.primary}
          />
        </View>
      )}
      <Text
        variant="bodySmall"
        style={{ color: props.textColor ? props.textColor : (props.mode === "outlined" ? theme.colors.primary : "#FFFFFF") }}
        className="font-semibold py-3"
      >
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
