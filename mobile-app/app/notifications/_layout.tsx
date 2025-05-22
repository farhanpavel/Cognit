"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Surface, Text, IconButton, Divider, Badge, Button, Chip } from "react-native-paper"

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
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}api/user/get-notification`)
        console.log("Response:", response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setNotifications(data)
      } catch (err) {
        console.error("Failed to fetch notifications:", err)
        setError("Failed to load notifications. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const toggleExpand = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    if (notification && (notification.formLink || notification.meetLink)) {
      setExpandedId(expandedId === id ? null : id)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // First update locally for instant feedback
      setNotifications(
        notifications.map((notification) => 
          notification.id === id ? { ...notification, read: true } : notification
        ),
      )
      
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
      // Revert local change if API call fails
      setNotifications(
        notifications.map((notification) => 
          notification.id === id ? { ...notification, read: false } : notification
        ),
      )
    }
  }

  const handleNotificationPress = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    if (!notification?.read) {
      markAsRead(id)
    }
    toggleExpand(id)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getTopicColor = (topic: string) => {
    return topicColors[topic] || topicColors.default
  }

  const formatTimestamp = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Surface style={styles.header} elevation={2}>
          <Text style={styles.title}>Notifications</Text>
        </Surface>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#20B486" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Surface style={styles.header} elevation={2}>
          <Text style={styles.title}>Notifications</Text>
        </Surface>
        <View style={styles.errorContainer}>
          <IconButton icon="alert-circle-outline" size={48} iconColor="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => {
              setLoading(true)
              setError(null)
              fetchNotifications()
            }}
            style={styles.retryButton}
            buttonColor="#20B486"
          >
            Retry
          </Button>
        </View>
      </SafeAreaView>
    )
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
                    <Text style={styles.timestamp}>{formatTimestamp(notification.createdAt)}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
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
    color: "#FF6B6B",
    textAlign: "center",
    marginVertical: 12,
  },
  retryButton: {
    marginTop: 16,
  },
})

export default NotificationScreen