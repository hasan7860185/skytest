export const notificationsTranslations = {
  title: "الإشعارات",
  empty: "لا توجد إشعارات",
  clientAction: "إجراء العميل",
  taskReminder: "تذكير المهمة",
  aiReminder: "تذكير الذكاء الاصطناعي",
  errorLoading: "حدث خطأ في تحميل الإشعارات",
  clientNotFound: "لم يتم العثور على العميل",
  errorFindingClient: "حدث خطأ أثناء البحث عن العميل",
  clientPageOpened: "تم فتح صفحة العميل",
  errorHandlingNotification: "حدث خطأ أثناء معالجة الإشعار",
  deleteSuccess: "تم حذف الإشعارات بنجاح",
  deleteError: "حدث خطأ أثناء حذف الإشعارات",
  deleteAll: "حذف الكل",
  allDeleted: "تم حذف جميع الإشعارات",
  markedAsRead: "تم تحديد الإشعار كمقروء",
  errorMarkingRead: "حدث خطأ أثناء تحديد الإشعار كمقروء",
  delayedClient: {
    title: "تذكير بإجراء للعميل",
    message: "لديك إجراء مستحق للعميل: {{clientName}} - {{actionType}} في {{time}}",
    defaultAction: "متابعة العميل"
  },
  readStatus: {
    read: "مقروء",
    unread: "غير مقروء",
    markAllAsRead: "تحديد الكل كمقروء"
  },
  unknownClient: "عميل غير معروف",
  noTime: "لم يتم تحديد الوقت"
} as const;