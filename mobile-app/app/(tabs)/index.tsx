import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Text, useTheme } from "react-native-paper";
import {
  ScrollView,
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import {
  BookOpen,
  FlaskConical,
  Download,
  LogOut,
  Award,
  Clock,
  User,
  Bell,
  ChevronRight
} from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [userName, setUserName] = useState("Alex");

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Navigation options
  const navOptions = [
    {
      title: "Study",
      description: "Access interactive lessons & simulations",
      icon: BookOpen,
      color: "#20B486",
      route: "/menu",
      bgColor: "rgba(32, 180, 134, 0.1)"
    },
    {
      title: "Research",
      description: "Explore scientific research projects",
      icon: FlaskConical,
      color: "#20B486",
      route: "/research",
      bgColor: "rgba(32, 180, 134, 0.1)"
    },
    {
      title: "Download",
      description: "Get offline study materials",
      icon: Download,
      color: "#20B486",
      route: "/download",
      bgColor: "rgba(32, 180, 134, 0.1)"
    }
  ];

  // Stats data
  const statsData = [
    {
      value: "12",
      label: "Courses"
    },
    {
      value: "37",
      label: "Completed"
    },
    {
      value: "4.8",
      label: "Rating"
    }
  ];

  return (
    <ScrollView
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="always"
    >
      <StatusBar backgroundColor="#20B486" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}!</Text>
            <Text style={styles.subGreeting}>
              Ready to learn something new?
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={()=>{
              router.push("/notifications");
            }}>
              <Bell size={20} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Profile Summary */}
      <View style={styles.profileSummary}>
        <View style={styles.profileIconContainer}>
          <User size={24} color="#20B486" strokeWidth={2} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}'s Learning Journey</Text>
          <Text style={styles.profileStatus}>Advanced Level</Text>
        </View>
        <TouchableOpacity
          style={styles.profileAction}
          onPress={() => router.push("/profile")}
        >
          <ChevronRight size={20} color="#20B486" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Navigation Options - Single Column */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Educational Services</Text>
        <View style={styles.navColumn}>
          {navOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => router.push(option.route)}
            >
              <View
                style={[
                  styles.navIconContainer,
                  { backgroundColor: option.bgColor }
                ]}
              >
                <option.icon size={24} color={option.color} strokeWidth={2} />
              </View>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle}>{option.title}</Text>
                <Text style={styles.navDescription}>{option.description}</Text>
              </View>
              <ChevronRight size={20} color="#20B486" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Award size={20} color="#20B486" strokeWidth={2} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Completed Physics Quiz</Text>
              <View style={styles.activityTimeContainer}>
                <Clock size={12} color="#666" strokeWidth={2} />
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <BookOpen size={20} color="#20B486" strokeWidth={2} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Started Chemistry Module</Text>
              <View style={styles.activityTimeContainer}>
                <Clock size={12} color="#666" strokeWidth={2} />
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA"
  },
  header: {
    backgroundColor: "#20B486",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  },
  subGreeting: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4
  },
  iconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 12
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 12
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 15
  },
  statItem: {
    alignItems: "center"
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4
  },
  profileSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(32, 180, 134, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  profileStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 2
  },
  profileAction: {
    padding: 5
  },
  section: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15
  },
  navColumn: {
    gap: 15
  },
  navItem: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  navIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  navTextContainer: {
    flex: 1
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4
  },
  navDescription: {
    fontSize: 13,
    color: "#666"
  },
  activityContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(32, 180, 134, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4
  },
  activityTimeContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4
  }
});
