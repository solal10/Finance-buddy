import { StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 16,
  },

  // Card styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  dateFormat: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    color: '#9CA3AF',
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 4,
  },

  // Button styles
  button: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },

  // Child styles
  childInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  childName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  childAge: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 10,
  },
  childCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  childCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  childInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  childAgeInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    marginRight: 10,
  },
  childButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  childButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  childList: {
    marginTop: 15,
  },
  childListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 10,
  },
  childListItemText: {
    fontSize: 16,
    color: '#333',
  },
  childListItemAge: {
    fontSize: 14,
    color: '#6B7280',
  },
  childListItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childListItemButton: {
    padding: 8,
    borderRadius: 6,
  },
  childListItemButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  childListItemEditButton: {
    backgroundColor: '#3B82F6',
    marginRight: 10,
  },
  childListItemDeleteButton: {
    backgroundColor: '#EF4444',
  },

  // Keyboard avoiding view
  keyboardAvoidingView: {
    flex: 1,
  },

  // Compact input styles
  compactInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compactInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  compactInputLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 16,
  },
  compactInputValue: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },

  // Country styles
  countryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  countryItemActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  countryName: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  countryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  countryTextActive: {
    color: '#fff',
  },
  countryFlag: {
    fontSize: 16,
  },

  // Children summary styles
  childrenSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  childrenCount: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },

  // Method type styles
  methodTypeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  methodTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  methodTypeName: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  methodTypeIcon: {
    fontSize: 16,
  },

  // Button container styles
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  backButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  backButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },

  // Step styles
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Input group styles
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  // Language styles
  languageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageItemActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  languageTextActive: {
    color: '#fff',
  },

  // Form styles
  form: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 20,
  },

  // Footer styles
  footer: {
    marginTop: 'auto',
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },

  // Progress styles
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },

  // Compact input styles
  compactInputGroup: {
    marginBottom: 8,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rtlInput: {
    textAlign: 'right',
  },

  // Currency styles
  currencyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencyItemActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 6,
  },
  currencyTextActive: {
    color: '#fff',
  },

  // Counter styles
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterButtonDisabled: {
    opacity: 0.5,
    borderColor: colors.textLight,
  },
  counterText: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // Member card styles
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  memberCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  memberIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberCardContent: {
    padding: 16,
  },
  memberField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberFieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
  },

  // Child card styles
  childCardContent: {
    padding: 12,
  },
  childField: {
    marginBottom: 8,
  },
  childFieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  childrenSummaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },

  // Section divider
  sectionDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },

  // Budget styles
  calculatedBudgetContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  calculatedBudgetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  calculatedBudgetInfo: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Insurance styles
  insuranceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insuranceButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  insuranceSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  insuranceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  insuranceItemType: {
    fontSize: 14,
    color: '#333',
  },
  insuranceItemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  insuranceInputGroup: {
    marginBottom: 16,
  },
  insuranceTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insuranceTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  insuranceTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  insuranceInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bank account styles
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  bankAccountContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  bankAccountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bankAccountIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bankAccountTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  bankAccountContent: {
    padding: 12,
  },
  bankAccountField: {
    marginBottom: 12,
  },
  bankAccountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  bankAccountInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Payment method styles
  paymentMethodContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  methodTypeItemActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  methodTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginLeft: 6,
  },
  methodTypeTextActive: {
    color: '#fff',
  },
  linkedAccountList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkedAccountItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkedAccountItemActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  linkedAccountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  linkedAccountTextActive: {
    color: '#fff',
  },

  // Category styles
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  subcategoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  subcategoryItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subcategoryItemActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  subcategoryText: {
    fontSize: 12,
    color: '#333',
  },
  subcategoryTextActive: {
    color: '#fff',
  },

  // Navigation styles
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  navigationButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },

  // Input text styles
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  placeholderText: {
    color: '#6B7280',
  },

  // Loan styles
  loanContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  loanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  loanName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  loanAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },

  // Expense styles
  expenseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  expenseName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 16,
  },
  expensePaymentMethod: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 16,
  },
  paymentMethodPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  picker: {
    height: 40,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Expense item styles
  expenseItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  expenseItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  expenseItemContent: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: 8,
  },
  expenseItemInput: {
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 