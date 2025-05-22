"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Surface, Text, IconButton, Divider, Badge, Button, Chip } from "react-native-paper"

// Sample notification data with topics
const sampleNotifications = [
  {
    id: 1,
    title: "Physics Assignment Due",
    message: "Your velocity formulas assignment is due tomorrow at 11:59 PM. Please submit it on time.",
    timestamp: "2 hours ago",
    read: false,
    topic: "education",
    formLink: "https://forms.example.com/physics-assignment",
    meetLink: "https://meet.example.com/physics-class",
  },
  {
    id: 2,
    title: "Chemistry Lab Rescheduled",
    message: "The chemistry lab session has been rescheduled to next Monday due to equipment maintenance.",
    timestamp: "Yesterday",
    read: false,
    topic: "education",
    formLink: "https://forms.example.com/chemistry-reschedule",
  },
  {
    id: 3,
    title: "Research Paper Accepted",
    message: "Congratulations! Your research paper on quantum mechanics has been accepted for publication.",
    timestamp: "2 days ago",
    read: true,
    topic: "research",
    meetLink: "https://meet.example.com/research-discussion",
  },
  {
    id: 4,
    title: "Biology Project Groups",
    message: "Biology project groups have been assigned. Check the portal for your group members and topic.",
    timestamp: "3 days ago",
    read: true,
    topic: "education",
  },
  {
    id: 5,
    title: "Research Grant Opportunity",
    message: "New research grant opportunity available for physics students. Application deadline is next month.",
    timestamp: "4 days ago",
    read: true,
    topic: "research",
    formLink: "https://forms.example.com/grant-application",
  },
  {
    id: 6,
    title: "System Maintenance",
    message: "The learning portal will be under maintenance this Saturday from 2 AM to 5 AM. Plan accordingly.",
    timestamp: "1 week ago",
    read: true,
    topic: "system",
    formLink: "https://forms.example.com/maintenance-feedback",
    meetLink: "https://meet.example.com/it-support",
  },
]

// Topic color mapping
const topicColors = {
  education: {
    bg: "#E6F7F1",
    text: "#20B486",
  },
  research: {
    bg: "#E6EEF7",
    text: "#4285F4",
  },
  system: {
    bg: "#F7EFE6",
    text: "#F4A142",
  },
  default: {
    bg: "#F0F0F0",
    text: "#666666",
  },
}

const NotificationScreen = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [notifications, setNotifications] = useState(sampleNotifications)

  const toggleExpand = (id: number) => {
    const notification = notifications.find((n) => n.id === id)
    if (notification && (notification.formLink || notification.meetLink)) {
      setExpandedId(expandedId === id ? null : id)
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleNotificationPress = (id: number) => {
    markAsRead(id)
    toggleExpand(id)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getTopicColor = (topic: string) => {
    return topicColors[topic] || topicColors.default
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <Badge size={24} style={styles.badge}>
            {unreadCount}
          </Badge>
        )}
      </Surface>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <IconButton icon="bell-off-outline" size={48} iconColor="#20B486" />
          <Text style={styles.emptyStateText}>No notifications yet</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {notifications.map((notification) => {
            const topicColor = getTopicColor(notification.topic)

            return (
              <Surface key={notification.id} style={styles.notificationCard} elevation={2}>
                <TouchableOpacity
                  style={[styles.notificationItem, !notification.read && styles.unreadNotification]}
                  onPress={() => handleNotificationPress(notification.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationHeader}>
                    <View style={styles.titleContainer}>
                      {!notification.read && <View style={styles.unreadDot} />}
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                    </View>
                    <Text style={styles.timestamp}>{notification.timestamp}</Text>
                  </View>

                  <View style={styles.tagContainer}>
                    <Chip
                      style={[styles.topicTag, { backgroundColor: topicColor.bg }]}
                      textStyle={{ color: topicColor.text, fontSize: 12 }}
                    >
                      <Text variant="bodySmall">{notification.topic.charAt(0).toUpperCase() + notification.topic.slice(1)}</Text>
                    </Chip>
                  </View>

                  <Text style={styles.message} numberOfLines={expandedId === notification.id ? undefined : 2}>
                    {notification.message}
                  </Text>

                  {(notification.formLink || notification.meetLink) && (
                    <View style={styles.expandIndicator}>
                      <IconButton
                        icon={expandedId === notification.id ? "chevron-up" : "chevron-down"}
                        size={20}
                        iconColor="#20B486"
                      />
                    </View>
                  )}

                  {expandedId === notification.id && (
                    <View style={styles.expandedContent}>
                      <Divider style={styles.divider} />
                      <View style={styles.buttonContainer}>
                        {notification.formLink && (
                          <Button
                            mode="outlined"
                            onPress={() => console.log("Form link pressed:", notification.formLink)}
                            style={styles.actionButton}
                            textColor="#20B486"
                            icon="file-document-outline"
                          >
                            Open Form
                          </Button>
                        )}
                        {notification.meetLink && (
                          <Button
                            mode="contained"
                            onPress={() => console.log("Meet link pressed:", notification.meetLink)}
                            style={styles.actionButton}
                            buttonColor="#20B486"
                            icon="video-outline"
                          >
                            Join Meeting
                          </Button>
                        )}
                      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#20B486",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  badge: {
    backgroundColor: "#17A97B",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  notificationItem: {
    backgroundColor: "white",
    padding: 16,
  },
  unreadNotification: {
    backgroundColor: "#f5f9f7",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#20B486",
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C9777",
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  topicTag: {
    height: "auto",
    borderRadius: 12,
  },
  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  expandIndicator: {
    alignItems: "center",
    marginTop: 8,
  },
  expandedContent: {
    marginTop: 8,
  },
  divider: {
    backgroundColor: "#A8E2D0",
    height: 1,
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  actionButton: {
    borderColor: "#20B486",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
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

export default NotificationScreen
