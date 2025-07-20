import { StyleSheet, Dimensions, Platform } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
// Is small screen
const isSmallScreen = width <= 375;
const isVerySmallScreen = width <= 320;

// Colors
const colors = {
  primary: '#ff6b6b',
  secondary: '#5ac8fa',
  tertiary: '#5e5ce6',
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9f9fb',
    100: '#f3f4f6',
    200: '#f2f2f7',
    300: '#e5e7eb',
    400: '#d1d5db',
    500: '#8e8e93',
    600: '#6b7280',
    700: '#5d5d5d',
    800: '#374151',
    900: '#111827',
  },
  status: {
    good: '#34c759',
    warning: '#ff9500',
    alert: '#ff3b30',
  },
  heart: {
    bg: '#FFEBEE',
    icon: '#F44336',
  },
  weight: {
    bg: '#E3F2FD',
    icon: '#2196F3',
  },
  calories: {
    bg: '#E8F5E9',
    icon: '#4CAF50',
  },
  vetVisit: {
    bg: '#EBF8FF',
    border: '#A9D0F5',
    title: '#1E40AF',
    text: '#1E3A8A',
  },
  allergy: {
    severe: {
      bg: '#FFEBEE',
      text: '#E53935',
    },
    moderate: {
      bg: '#FFF8E1',
      text: '#F57F17',
    },
  },
  petInfoTag: {
    breed: {
      bg: '#ECEFF1',
      text: '#546E7A',
    },
    age: {
      bg: '#FFF8E1',
      text: '#FFA000',
    },
    genderMale: {
      bg: '#E3F2FD',
      text: '#4A90E2',
    },
    genderFemale: {
      bg: '#FCE4EC',
      text: '#FF4081',
    },
  },
  specialNotes: {
    bg: '#FFF3C4',
    border: '#FFA000',
    icon: {
      bg: '#FFFDE7',
      color: '#F57C00',
    },
    title: '#F57C00',
    text: '#5D4037',
  },
  rescheduleBtn: {
    bg: '#FFCC80',
    text: '#E65100',
  },
};

// Shadow styles for different elevation levels
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
};

// Common styles for the PetPaw app
const styles = StyleSheet.create({
  // Status bar styling
  statusBar: {
    height: 44,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },

  // Tab bar styling
  tabBar: {
    height: Platform.OS === 'ios' ? 83 : 63, // Adjust for iOS home indicator
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // For iPhone home indicator
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  tabItemActive: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    color: colors.primary,
  },
  tabIconContainer: {
    marginBottom: 4,
  },
  tabIcon: {
    fontSize: 24,
    color: colors.gray[500],
  },
  tabIconActive: {
    fontSize: 24,
    color: colors.primary,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.gray[500],
  },
  tabLabelActive: {
    fontSize: 10,
    color: colors.primary,
  },

  // Content area
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContent: {
    paddingBottom: 100, // Space for tab bar
  },

  // Card styling
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...shadows.medium,
  },

  // Pet avatar
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  petAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  // Button styling
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.black,
    fontWeight: '600',
    fontSize: 14,
  },

  // Typography
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.black,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.black,
  },

  // Health status indicators
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusGood: {
    backgroundColor: colors.status.good,
  },
  statusWarning: {
    backgroundColor: colors.status.warning,
  },
  statusAlert: {
    backgroundColor: colors.status.alert,
  },

  // Custom colors text
  petPrimary: {
    color: colors.primary,
  },
  petSecondary: {
    color: colors.secondary,
  },
  petTertiary: {
    color: colors.tertiary,
  },

  // Utility classes
  flexCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexStart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  flexColumn: {
    flexDirection: 'column',
  },

  // Badge
  badge: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },

  // Pet info tags styling
  petInfoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  petInfoTagsGap: {
    width: 6,
    height: 6,
  },
  petInfoTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 11,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  petInfoTagBreed: {
    backgroundColor: colors.petInfoTag.breed.bg,
  },
  petInfoTagBreedText: {
    color: colors.petInfoTag.breed.text,
    fontSize: 11,
    fontWeight: '500',
  },
  petInfoTagAge: {
    backgroundColor: colors.petInfoTag.age.bg,
  },
  petInfoTagAgeText: {
    color: colors.petInfoTag.age.text,
    fontSize: 11,
    fontWeight: '500',
  },
  petInfoTagGenderMale: {
    backgroundColor: colors.petInfoTag.genderMale.bg,
  },
  petInfoTagGenderMaleText: {
    color: colors.petInfoTag.genderMale.text,
    fontSize: 11,
    fontWeight: '500',
  },
  petInfoTagGenderFemale: {
    backgroundColor: colors.petInfoTag.genderFemale.bg,
  },
  petInfoTagGenderFemaleText: {
    color: colors.petInfoTag.genderFemale.text,
    fontSize: 11,
    fontWeight: '500',
  },
  petInfoTagIcon: {
    fontSize: 10,
    marginRight: 4,
  },

  // Pet Profile - Diet Information
  dietItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
  },
  dietInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dietFoodImg: {
    width: 48,
    height: 48,
    borderRadius: 10,
    ...shadows.small,
  },
  dietFoodDetails: {
    marginLeft: 12,
  },
  dietFoodName: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.gray[800],
  },
  dietFoodBrand: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
  },
  dietQuantity: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.gray[700],
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    ...shadows.small,
  },

  // Allergies & Restrictions
  allergiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergiesGap: {
    width: 6,
    height: 6,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
  },
  allergyTagSevere: {
    backgroundColor: colors.allergy.severe.bg,
  },
  allergyTagSevereText: {
    color: colors.allergy.severe.text,
    fontSize: 12,
    fontWeight: '500',
  },
  allergyTagModerate: {
    backgroundColor: colors.allergy.moderate.bg,
  },
  allergyTagModerateText: {
    color: colors.allergy.moderate.text,
    fontSize: 12,
    fontWeight: '500',
  },
  allergyTagIcon: {
    fontSize: 10,
    marginRight: 4,
  },

  // Behavior & Training
  behaviorCard: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'column',
    minHeight: isVerySmallScreen ? 80 : isSmallScreen ? 90 : 100,
  },
  behaviorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  behaviorIcon: {
    width: isVerySmallScreen ? 22 : isSmallScreen ? 24 : 28,
    height: isVerySmallScreen ? 22 : isSmallScreen ? 24 : 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  behaviorIconStyle: {
    fontSize: isVerySmallScreen ? 11 : isSmallScreen ? 12 : 14,
  },
  behaviorTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.gray[800],
    marginLeft: 8,
  },
  behaviorContentWrapper: {
    marginLeft: isVerySmallScreen ? 28 : isSmallScreen ? 32 : 36,
    flex: 1,
    justifyContent: 'flex-start',
  },
  behaviorContent: {
    fontSize: isVerySmallScreen ? 11 : isSmallScreen ? 12 : 13,
    color: colors.gray[700],
    marginBottom: 4,
    lineHeight: 20,
    height: isVerySmallScreen ? 42 : isSmallScreen ? 45 : 48, // Approximately 2 lines
  },
  behaviorDescription: {
    fontSize: isVerySmallScreen ? 9 : isSmallScreen ? 10 : 11,
    color: colors.gray[500],
    fontStyle: 'italic',
  },

  // Special Notes
  specialNotes: {
    backgroundColor: colors.specialNotes.bg,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.specialNotes.border,
  },
  specialNotesIcon: {
    backgroundColor: colors.specialNotes.icon.bg,
  },
  specialNotesIconColor: {
    color: colors.specialNotes.icon.color,
  },
  specialNotesTitle: {
    color: colors.specialNotes.title,
  },
  specialNotesContent: {
    color: colors.specialNotes.text,
    height: 'auto',
    marginBottom: 0,
    fontSize: isVerySmallScreen ? 11 : isSmallScreen ? 12 : 13,
  },

  // Basic Information
  basicInfoContainer: {
    marginBottom: 16, 
  },
  basicInfoItem: {
    padding: isVerySmallScreen ? 6 : isSmallScreen ? 6 : 8,
    paddingHorizontal: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
    backgroundColor: colors.gray[50],
    borderRadius: 10,
    marginBottom: isVerySmallScreen ? 12 : 16,
  },
  basicInfoLabel: {
    fontSize: isVerySmallScreen ? 10 : 11,
    color: colors.gray[600],
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: isVerySmallScreen ? 2 : 4,
  },
  basicInfoValue: {
    fontSize: isVerySmallScreen ? 13 : isSmallScreen ? 14 : 15,
    color: colors.gray[800],
    fontWeight: '500',
  },
  basicInfoValueBreed: {
    color: colors.gray[800],
    fontWeight: '600',
  },
  basicInfoValueAgeWeight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueUnit: {
    fontSize: isVerySmallScreen ? 11 : 13,
    color: colors.gray[600],
    fontWeight: 'normal',
    marginLeft: 4,
  },
  microchipText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.5,
  },

  // Home Page - Health Stats
  healthStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  healthStatCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
    paddingHorizontal: isVerySmallScreen ? 4 : isSmallScreen ? 6 : 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    ...shadows.medium,
  },
  statIconContainer: {
    width: isVerySmallScreen ? 34 : isSmallScreen ? 38 : 42,
    height: isVerySmallScreen ? 34 : isSmallScreen ? 38 : 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isVerySmallScreen ? 6 : 8,
  },
  heartIconBg: {
    backgroundColor: colors.heart.bg,
  },
  weightIconBg: {
    backgroundColor: colors.weight.bg,
  },
  caloriesIconBg: {
    backgroundColor: colors.calories.bg,
  },
  statIcon: {
    fontSize: isVerySmallScreen ? 14 : 16,
  },
  heartIcon: {
    color: colors.heart.icon,
  },
  weightIcon: {
    color: colors.weight.icon,
  },
  caloriesIcon: {
    color: colors.calories.icon,
  },
  statLabel: {
    fontSize: isVerySmallScreen ? 10 : 11,
    color: colors.gray[600],
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: isVerySmallScreen ? 15 : isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: colors.gray[800],
    textAlign: 'center',
  },

  // Today's Tasks
  taskContainer: {
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    ...shadows.medium,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isVerySmallScreen ? 8 : 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  taskIconContainer: {
    width: isVerySmallScreen ? 32 : isSmallScreen ? 36 : 40,
    height: isVerySmallScreen ? 32 : isSmallScreen ? 36 : 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    marginLeft: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
    marginRight: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
  },
  taskTitle: {
    fontSize: isVerySmallScreen ? 14 : 15,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 2,
  },
  taskTime: {
    fontSize: isVerySmallScreen ? 11 : 12,
    color: colors.gray[600],
  },
  taskCheckbox: {
    width: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
    height: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[400],
  },

  // Upcoming Vet Visit
  vetVisitCard: {
    backgroundColor: colors.vetVisit.bg,
    borderWidth: 1,
    borderColor: colors.vetVisit.border,
    borderRadius: 16,
    padding: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
    marginTop: 16,
    ...shadows.medium,
  },
  vetVisitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vetIcon: {
    color: colors.secondary,
    fontSize: 16,
    marginRight: 8,
  },
  vetTitle: {
    fontSize: isVerySmallScreen ? 15 : 16,
    fontWeight: '600',
    color: colors.vetVisit.title,
  },
  vetInfo: {
    marginLeft: 24,
    marginBottom: 12,
  },
  vetDate: {
    fontSize: isVerySmallScreen ? 12 : 13,
    color: colors.vetVisit.text,
    marginBottom: 4,
    fontWeight: '500',
  },
  vetDoctor: {
    fontSize: isVerySmallScreen ? 12 : 13,
    color: colors.vetVisit.text,
    marginBottom: 4,
  },
  rescheduleBtn: {
    backgroundColor: colors.rescheduleBtn.bg,
    borderRadius: 12,
    paddingVertical: isVerySmallScreen ? 6 : 8,
    paddingHorizontal: isVerySmallScreen ? 12 : 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
    ...shadows.small,
  },
  rescheduleBtnText: {
    color: colors.rescheduleBtn.text,
    fontWeight: '600',
    fontSize: isVerySmallScreen ? 12 : 13,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },

  // Edit Profile Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  editContainer: {
    padding: 16,
  },
  editField: {
    marginBottom: 24,
  },
  editFieldLabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 8,
  },
  editableValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
  editableValueText: {
    fontSize: 16,
    fontWeight: '500',
  },
  editInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    marginRight: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: '600',
  },

  // Comment Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: colors.gray[500],
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
  },
  commentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentButtonDisabled: {
    backgroundColor: colors.gray[200],
  },

  // For small screen adjustments, use above variables isSmallScreen and isVerySmallScreen
});

export { styles, colors, shadows, isSmallScreen, isVerySmallScreen };