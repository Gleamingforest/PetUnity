import { StyleSheet, Platform } from 'react-native';

export const colors = {
  primary: '#9061F9',
  white: '#FFFFFF',
  gray: {
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  heart: {
    bg: '#FEE2E2',
    icon: '#EF4444',
  },
  weight: {
    bg: '#E0F2FE',
    icon: '#0EA5E9',
  },
  calories: {
    bg: '#FEF3C7',
    icon: '#F59E0B',
  },
  error: '#EF4444',
};

// 添加阴影样式
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
    ...(Platform.OS === 'web' && {
      height: '100%',
      width: '100%',
    }),
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    ...(Platform.OS === 'web' && {
      height: '100%',
    }),
  },
  scrollViewContent: {
    padding: 20,
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
    }),
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
  },
  sectionLink: {
    fontSize: 14,
    color: colors.primary,
  },
  healthStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  healthStatCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    ...shadows.small,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  taskContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 8,
    height: 200,
    overflow: 'hidden',
  },
  taskScrollView: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.gray[900],
  },
  taskTime: {
    fontSize: 14,
    color: colors.gray[500],
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  vetVisitCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  vetVisitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vetIcon: {
    fontSize: 20,
    color: colors.primary,
    marginRight: 8,
  },
  vetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  vetInfo: {
    marginBottom: 16,
  },
  vetDate: {
    fontSize: 16,
    color: colors.gray[900],
    marginBottom: 4,
  },
  vetDoctor: {
    fontSize: 14,
    color: colors.gray[500],
  },
  rescheduleBtn: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rescheduleBtnText: {
    color: colors.gray[700],
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...shadows.small,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    ...shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
  },
  healthRecord: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...shadows.small,
  },
  healthRecordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthRecordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  healthRecordDate: {
    fontSize: 14,
    color: colors.gray[500],
  },
  healthRecordStatus: {
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    padding: 8,
  },
  dietInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dietItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dietTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dietDescription: {
    fontSize: 14,
    color: colors.gray[500],
  },
  // Settings Screen Styles
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  accountText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Edit Profile Styles
  editField: {
    marginBottom: 20,
  },
  editFieldLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  editInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  editableValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  editableValueText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 