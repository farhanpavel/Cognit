import React, { useState, useEffect, useCallback, useRef } from "react";
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
import Voice from "@react-native-voice/voice";
import { Accelerometer } from "expo-sensors";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

export default function Menu() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const shakeCountRef = useRef(0);
  const shakeTimeoutRef = useRef(null);
  const accelerometerSubscriptionRef = useRef(null);
  const isMountedRef = useRef(true);

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
          icon: Waves,
          voiceCommand: "newton"
        },
        {
          id: "oscillation",
          title: "Oscillation",
          description: "Study wave patterns and periodic motion",
          icon: Waves,
          voiceCommand: "oscillation"
        },
        {
          id: "velocity",
          title: "Velocity & Acceleration",
          description: "Learn equations like s=vt, s=ut+1/2at²",
          icon: Car,
          voiceCommand: "velocity"
        },
        {
          id: "light",
          title: "Electricity & Light",
          description: "Experiment with current and voltage",
          icon: Lightbulb,
          voiceCommand: "electricity"
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
          icon: LineChart,
          voiceCommand: "graphs"
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
          icon: Heart,
          voiceCommand: "biology"
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
          icon: Droplets,
          voiceCommand: "chemistry"
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
          icon: Gamepad2,
          voiceCommand: "games"
        }
      ]
    }
  ];

  // Create voice commands map
  const navCommands = useRef({});
  useEffect(() => {
    const commands = {};
    categories.forEach((category) => {
      category.simulations.forEach((sim) => {
        commands[sim.voiceCommand] = `/${sim.id}`;
      });
    });
    navCommands.current = commands;
  }, []);

  // Voice result handler
  const onSpeechResults = useCallback((event) => {
    if (!isMountedRef.current) return;

    const text = event.value[0]?.toLowerCase() ?? "";
    console.log("Recognized voice command:", text);

    for (const key in navCommands.current) {
      if (text.includes(key)) {
        router.push(navCommands.current[key]);
        break;
      }
    }

    setIsListening(false);
  }, []);

  const startVoiceCommand = async () => {
    if (!isMountedRef.current) return;

    try {
      await Voice.destroy(); // Ensure any previous instance is cleaned up
      await Voice.removeAllListeners();
      Voice.onSpeechResults = onSpeechResults;
      await Voice.start("en-US");
      setIsListening(true);
    } catch (error) {
      console.error("Voice start error:", error);
    }
  };

  const speakIntroAndListen = useCallback(() => {
    if (!isMountedRef.current) return;

    // Stop any ongoing speech from other screens
    Speech.stop();

    // Create a list of available simulations
    const simulationList = categories
      .flatMap((category) => category.simulations.map((sim) => sim.title))
      .join(", ");

    const message = `Available simulations: ${simulationList}. Say the name of the simulation you want to open.`;

    Speech.speak(message, {
      language: "en",
      onDone: () => {
        if (isMountedRef.current) {
          startVoiceCommand();
        }
      },
      onError: (error) => {
        console.error("Speech error:", error);
      }
    });
  }, []);

  const handleShake = useCallback(
    ({ x, y, z }) => {
      if (!isMountedRef.current) return;

      const acceleration = Math.sqrt(x * x + y * y + z * z);
      if (acceleration > 1.5) {
        shakeCountRef.current += 1;

        if (shakeTimeoutRef.current) {
          clearTimeout(shakeTimeoutRef.current);
        }

        shakeTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            shakeCountRef.current = 0;
          }
        }, 1500);

        if (shakeCountRef.current >= 2) {
          shakeCountRef.current = 0;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          console.log("Shake detected - speaking available simulations");
          speakIntroAndListen();
        }
      }
    },
    [speakIntroAndListen]
  );

  useEffect(() => {
    isMountedRef.current = true;

    // Setup accelerometer
    const setupAccelerometer = async () => {
      accelerometerSubscriptionRef.current =
        Accelerometer.addListener(handleShake);
    };
    setupAccelerometer();

    return () => {
      isMountedRef.current = false;

      // Cleanup accelerometer
      if (accelerometerSubscriptionRef.current) {
        accelerometerSubscriptionRef.current.remove();
        accelerometerSubscriptionRef.current = null;
      }

      // Clear any pending timeouts
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }

      // Cleanup voice recognition
      Voice.destroy()
        .then(() => {
          Voice.removeAllListeners();
        })
        .catch((error) => {
          console.error("Voice cleanup error:", error);
        });

      // Stop any ongoing speech
      Speech.stop();
    };
  }, [handleShake]);

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

  // Rest of your component remains the same...
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
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: "#20B486",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  scrollView: {
    flex: 1
  },
  introSection: {
    padding: 20,
    alignItems: "center"
  },
  introIconContainer: {
    backgroundColor: "rgba(32, 180, 134, 0.1)",
    padding: 16,
    borderRadius: 50,
    marginBottom: 12
  },
  introTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center"
  },
  introText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24
  },
  categorySection: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },
  simulationsContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12
  },
  simulationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8
  },
  simulationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  simulationInfo: {
    flex: 1
  },
  simulationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4
  },
  simulationDescription: {
    fontSize: 14,
    color: "#666"
  }
});
