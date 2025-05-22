"use client"

import { useEnrollResearchMutation, useGetResearchesQuery } from "@/modules/profile/api/profile.api"
import { useState } from "react"
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Surface, Text, IconButton, Divider, Button, Chip, Avatar } from "react-native-paper"

// Types for research data
interface Creator {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
}

interface DataCollector {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
}

interface Research {
  id: string
  title: string
  description: string
  meetingLink?: string
  formLink?: string
  meetingDate: string
  duration: number
  agenda: string
  schedule: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCEL"
  createdAt: string
  updatedAt: string
  creator: Creator
  dataCollectors: DataCollector[]
  _count: {
    dataCollectors: number
  }
}

const ResearchProjects = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Fetch research data
  const { data: researches, isLoading, isError, refetch } = useGetResearchesQuery()

  // Enroll in research
  const [enrollResearch, { isLoading: isEnrolling }] = useEnrollResearchMutation()

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleEnroll = async (id: string) => {
    try {
      await enrollResearch({ id }).unwrap()
      // Refetch data after successful enrollment
      refetch()
    } catch (error) {
      console.error("Failed to enroll:", error)
    }
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status color based on schedule
  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return { bg: "#E6F7F1", text: "#20B486" }
      case "ONGOING":
        return { bg: "#E6EEF7", text: "#4285F4" }
      case "COMPLETED":
        return { bg: "#F0F0F0", text: "#666666" }
      case "CANCEL":
        return { bg: "#FEEAEA", text: "#E53935" }
      default:
        return { bg: "#F0F0F0", text: "#666666" }
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Surface style={styles.header} elevation={2}>
          <Text style={styles.title}>Research Projects</Text>
        </Surface>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#20B486" />
          <Text style={styles.loadingText}>Loading research projects...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Surface style={styles.header} elevation={2}>
          <Text style={styles.title}>Research Projects</Text>
        </Surface>
        <View style={styles.errorContainer}>
          <IconButton icon="alert-circle-outline" size={48} iconColor="#E53935" />
          <Text style={styles.errorText}>Failed to load research projects</Text>
          <Button mode="contained" onPress={() => refetch()} style={styles.retryButton} buttonColor="#20B486">
            Retry
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Text style={styles.title}>Research Projects</Text>
      </Surface>

      {researches && researches.length === 0 ? (
        <View style={styles.emptyState}>
          <IconButton icon="flask-empty-outline" size={48} iconColor="#20B486" />
          <Text style={styles.emptyStateText}>No research projects available</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {researches?.map((research: Research) => {
            const statusColor = getStatusColor(research.schedule)

            return (
              <Surface key={research.id} style={styles.researchCard} elevation={2}>
                <TouchableOpacity
                  style={styles.researchItem}
                  onPress={() => toggleExpand(research.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.researchHeader}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.researchTitle}>{research.title}</Text>
                    </View>
                    <Chip
                      style={[styles.statusChip, { backgroundColor: statusColor.bg }]}
                      textStyle={{ color: statusColor.text, fontSize: 12 }}
                    >
                      {research.schedule}
                    </Chip>
                  </View>

                  <Text style={styles.description} numberOfLines={expandedId === research.id ? undefined : 2}>
                    {research.description}
                  </Text>

                  <View style={styles.metaContainer}>
                    <View style={styles.dateContainer}>
                      <IconButton icon="calendar" size={16} iconColor="#1C9777" style={styles.metaIcon} />
                      <Text style={styles.metaText}>{formatDate(research.meetingDate)}</Text>
                    </View>
                    <View style={styles.durationContainer}>
                      <IconButton icon="clock-outline" size={16} iconColor="#1C9777" style={styles.metaIcon} />
                      <Text style={styles.metaText}>{research.duration} min</Text>
                    </View>
                  </View>

                  <View style={styles.creatorContainer}>
                    <Avatar.Text
                      size={24}
                      label={research.creator.name.substring(0, 2).toUpperCase()}
                      backgroundColor="#20B486"
                      color="white"
                      style={styles.creatorAvatar}
                    />
                    <Text style={styles.creatorName}>{research.creator.name}</Text>
                    <Text style={styles.creatorRole}>{research.creator.role}</Text>
                  </View>

                  <View style={styles.expandIndicator}>
                    <View style={styles.enrollmentCount}>
                      <IconButton icon="account-group" size={16} iconColor="#1C9777" style={styles.metaIcon} />
                      <Text style={styles.enrollmentText}>
                        {research._count.dataCollectors}{" "}
                        {research._count.dataCollectors === 1 ? "Participant" : "Participants"}
                      </Text>
                    </View>
                    <IconButton
                      icon={expandedId === research.id ? "chevron-up" : "chevron-down"}
                      size={20}
                      iconColor="#20B486"
                    />
                  </View>

                  {expandedId === research.id && (
                    <View style={styles.expandedContent}>
                      <Divider style={styles.divider} />

                      {research.agenda && (
                        <View style={styles.agendaContainer}>
                          <Text style={styles.sectionTitle}>Agenda</Text>
                          <Text style={styles.agendaText}>{research.agenda}</Text>
                        </View>
                      )}

                      {research.dataCollectors.length > 0 && (
                        <View style={styles.participantsContainer}>
                          <Text style={styles.sectionTitle}>Participants</Text>
                          <View style={styles.participantsList}>
                            {research.dataCollectors.map((participant) => (
                              <View key={participant.id} style={styles.participantItem}>
                                <Avatar.Text
                                  size={24}
                                  label={participant.name.substring(0, 2).toUpperCase()}
                                  backgroundColor="#A8E2D0"
                                  color="#1C9777"
                                />
                                <Text style={styles.participantName}>{participant.name}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      <View style={styles.buttonContainer}>
                        {research.meetingLink && (
                          <Button
                            mode="outlined"
                            onPress={() => console.log("Meeting link:", research.meetingLink)}
                            style={styles.actionButton}
                            textColor="#20B486"
                            icon="video-outline"
                          >
                            Join Meeting
                          </Button>
                        )}
                        {research.formLink && (
                          <Button
                            mode="outlined"
                            onPress={() => console.log("Form link:", research.formLink)}
                            style={styles.actionButton}
                            textColor="#20B486"
                            icon="file-document-outline"
                          >
                            Open Form
                          </Button>
                        )}
                      </View>

                      <Button
                        mode="contained"
                        onPress={() => handleEnroll(research.id)}
                        style={styles.enrollButton}
                        buttonColor="#20B486"
                        icon="hand-wave"
                        loading={isEnrolling}
                        disabled={isEnrolling || research.schedule === "CANCEL"}
                      >
                        {isEnrolling ? "Enrolling..." : "I'm Interested"}
                      </Button>
                    </View>
                  )}
                </TouchableOpacity>
              </Surface>
            )
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  header: {
    padding: 15,
    backgroundColor: "#20B486",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
  },
  researchCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  researchItem: {
    backgroundColor: "white",
    padding: 16,
  },
  researchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  researchTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C9777",
  },
  statusChip: {
    height: 24,
    borderRadius: 12,
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    margin: 0,
    padding: 0,
    marginRight: -4,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  creatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  creatorAvatar: {
    marginRight: 8,
  },
  creatorName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  creatorRole: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  expandIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  enrollmentCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  enrollmentText: {
    fontSize: 12,
    color: "#1C9777",
    fontWeight: "bold",
  },
  expandedContent: {
    marginTop: 8,
  },
  divider: {
    backgroundColor: "#A8E2D0",
    height: 1,
    marginVertical: 12,
  },
  agendaContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C9777",
    marginBottom: 8,
  },
  agendaText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    backgroundColor: "#f5f9f7",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#20B486",
  },
  participantsContainer: {
    marginBottom: 16,
  },
  participantsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f9f7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  participantName: {
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  actionButton: {
    borderColor: "#20B486",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  enrollButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#E53935",
    marginBottom: 16,
  },
  retryButton: {
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
})

export default ResearchProjects
