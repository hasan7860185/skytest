export const notificationsTranslations = {
  title: "Notifications",
  empty: "No notifications",
  clientAction: "Client Action",
  taskReminder: "Task Reminder",
  aiReminder: "AI Reminder",
  errorLoading: "Error loading notifications",
  clientNotFound: "Client not found",
  errorFindingClient: "Error finding client",
  clientPageOpened: "Client page opened",
  errorHandlingNotification: "Error handling notification",
  deleteSuccess: "Notification deleted successfully",
  deleteError: "Error deleting notification",
  deleteAll: "Delete All",
  allDeleted: "All notifications deleted",
  markedAsRead: "Notification marked as read",
  errorMarkingRead: "Error marking notification as read",
  delayedClient: {
    title: "Client Action Reminder",
    message: "You have a pending action for client: {{clientName}} - {{actionType}} at {{time}}",
    defaultAction: "Follow up"
  },
  readStatus: {
    read: "Read",
    unread: "Unread",
    markAllAsRead: "Mark all as read"
  },
  unknownClient: "Unknown Client",
  noTime: "No time specified"
} as const;