import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { useRouter } from "expo-router";
import {
  Atom,
  Waves,
  Car,
  Lightbulb,
  LineChart,
  Droplets,
  Gamepad2,
  Heart,
  ArrowLeft,
  ChevronRight,
  BookOpen
} from "lucide-react-native";

export default function Menu() {
  const router = useRouter();

  // Categories with their simulations
  const categories = [
    {
      title: "Physics",
      icon: Atom,
      color: "#20B486",
      simulations: [
        {
          id: "physics-sim",
          title: "Newton's Laws",
          description: "Explore the fundamental laws of motion",
          icon: Waves
        },
        {
          id: "oscillation",
          title: "Oscillation",
          description: "Study wave patterns and periodic motion",
          icon: Waves
        },
        {
          id: "velocity",
          title: "Velocity & Acceleration",
          description: "Learn equations like s=vt, s=ut+1/2at²",
          icon: Car
        },
        {
          id: "light",
          title: "Electricity & Light",
          description: "Experiment with current and voltage",
          icon: Lightbulb
        }
      ]
    },
    {
      title: "Mathematics",
      icon: LineChart,
      color: "#4F46E5",
      simulations: [
        {
          id: "graph",
          title: "Interactive Graphs",
          description: "Visualize mathematical functions and data",
          icon: LineChart
        }
      ]
    },
    {
      title: "Biology",
      icon: Heart,
      color: "#F43F5E",
      simulations: [
        {
          id: "human",
          title: "Human Body Explorer",
          description: "Interactive exploration of human anatomy",
          icon: Heart
        }
      ]
    },
    {
      title: "Chemistry",
      icon: Droplets,
      color: "#0EA5E9",
      simulations: [
        {
          id: "water",
          title: "Chemical",
          description: "Study properties of chemical solutions",
          icon: Droplets
        }
      ]
    },
    {
      title: "Games",
      icon: Gamepad2,
      color: "#8B5CF6",
      simulations: [
        {
          id: "game",
          title: "Educational Games",
          description: "Learn through interactive gameplay",
          icon: Gamepad2
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#20B486" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Educational Simulations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introSection}>
          <View style={styles.introIconContainer}>
            <BookOpen size={32} color="#20B486" />
          </View>
          <Text style={styles.introTitle}>Interactive Learning</Text>
          <Text style={styles.introText}>
            Explore our collection of interactive simulations designed to help
            you understand complex concepts through visualization and
            experimentation.
          </Text>
        </View>

        {/* Categories and Simulations */}
        {categories.map((category, index) => (
          <View key={index} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: category.color }
                ]}
              >
                <category.icon size={24} color="#fff" />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>

            <View style={styles.simulationsContainer}>
              {category.simulations.map((simulation, simIndex) => (
                <TouchableOpacity
                  key={simIndex}
                  style={styles.simulationCard}
                  onPress={() => router.push(`/${simulation.id}`)}
                >
                  <View
                    style={[
                      styles.simulationIconContainer,
                      { backgroundColor: `${category.color}20` }
                    ]}
                  >
                    <simulation.icon size={24} color={category.color} />
                  </View>
                  <View style={styles.simulationInfo}>
                    <Text style={styles.simulationTitle}>
                      {simulation.title}
                    </Text>
                    <Text style={styles.simulationDescription}>
                      {simulation.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={category.color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Bottom padding */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#20B486",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  scrollView: {
    flex: 1
  },
  introSection: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  introIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(32, 180, 134, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  introTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10
  },
  introText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22
  },
  categorySection: {
    marginHorizontal: 16,
    marginBottom: 20
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  simulationsContainer: {
    gap: 12
  },
  simulationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  simulationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16
  },
  simulationInfo: {
    flex: 1
  },
  simulationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4
  },
  simulationDescription: {
    fontSize: 13,
    color: "#666"
  }
});
