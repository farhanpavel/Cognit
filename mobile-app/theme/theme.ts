import { Platform } from "react-native";
import { configureFonts, MD3LightTheme as MDTheme } from "react-native-paper";

export const theme = {
  ...MDTheme,
  myOwnProperty: true,

  fonts: configureFonts({
    config: {
      titleSmall: {
        fontFamily: "poppins",
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.1,
        lineHeight: 20
      },
      titleMedium: {
        fontFamily: "poppinsBold",
        fontSize: 16,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 27
      },
      titleLarge: {
        fontFamily: "poppinsBold",
        fontSize: 20,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 28
      },
      bodySmall: {
        fontFamily: "poppinsMedium",
        fontSize: 12,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20
      },
      bodyMedium: {
        fontFamily: "poppins",
        fontSize: 15,
        fontWeight: "400",
        letterSpacing: 0.1,
        lineHeight: 24
      },
      bodyLarge: {
        fontFamily: "poppins",
        fontSize: 20,
        fontWeight: "400",
        letterSpacing: 0.1,
        lineHeight: 28
      },

      caption: {
        fontFamily: "poppins",
        fontSize: 12,
        fontWeight: "400",
        letterSpacing: 0.1,
        lineHeight: 16
      },
      labelMedium: {
        fontFamily: "poppinsMedium",
        fontSize: 12,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 16
      },
      labelLarge: {
        fontFamily: "poppinsMedium",
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20
      }
    },
    isV3: true
  }),
  colors: {
    primary: "#20B486",
    secondary: "#1C9777",
    tertiary: "#17A97B",
    outlineVariant: "#A8E2D0",
    textInvert: "#FFFAFA",
    surface: "#FFFFFFD7",
    backdrop: "#FFFFFFD7",
    elevation: {
      level0: "transparent",
      level1: "#F7F3F9",
      level2: "#F3EDF6",
      level3: "#EEE8F4",
      level4: "#ECE6F3",
      level5: "#E9E3F1"
    }
  },
  roundness: 10
};
