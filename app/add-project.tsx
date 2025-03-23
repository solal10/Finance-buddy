import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors, categoryColors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { Check, Calendar, AlertCircle } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

// Project color options
const projectColors = [
  categoryColors.food,
  categoryColors.groceries,
  categoryColors.dining,
  categoryColors.utilities,
  categoryColors.rent,
  categoryColors.transportation,
  categoryColors.entertainment,
  categoryColors.shopping,
  categoryColors.health,
  categoryColors.education,
  categoryColors.travel,
  categoryColors.personal,
];

// Project icon options
const projectIcons = [
  'home',
  'car',
  'plane',
  'briefcase',
  'gift',
  'heart',
  'book',
  'smartphone',
  'laptop',
  'camera',
  'music',
  'coffee',
];

export default function AddProjectScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const addProject = useFinanceStore((state) => state.addProject);
  const getTotalHouseholdIncome = useFinanceStore((state) => state.getTotalHouseholdIncome);
  const isProjectFeasible = useFinanceStore((state) => state.isProjectFeasible);
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [numberOfMonths, setNumberOfMonths] = useState('12');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [selectedColor, setSelectedColor] = useState(projectColors[0]);
  const [selectedIcon, setSelectedIcon] = useState(projectIcons[0]);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState(new Date());
  const [isFeasible, setIsFeasible] = useState(true);
  
  // Calculate monthly investment when target amount or number of months changes
  useEffect(() => {
    if (targetAmount && numberOfMonths && !isNaN(parseFloat(targetAmount)) && !isNaN(parseInt(numberOfMonths))) {
      const monthly = parseFloat(targetAmount) / parseInt(numberOfMonths);
      setMonthlyInvestment(monthly.toFixed(2));
      
      // Check if the project is feasible
      setIsFeasible(isProjectFeasible(monthly));
    }
  }, [targetAmount, numberOfMonths, isProjectFeasible]);
  
  // Update deadline date when number of months changes
  useEffect(() => {
    if (numberOfMonths && !isNaN(parseInt(numberOfMonths))) {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() + parseInt(numberOfMonths));
      setDeadlineDate(newDate);
    }
  }, [numberOfMonths]);
  
  const handleAddProject = () => {
    if (!name || !targetAmount || parseFloat(targetAmount) <= 0 || !numberOfMonths || parseInt(numberOfMonths) <= 0) {
      return;
    }
    
    if (!isFeasible) {
      Alert.alert(
        t('investmentTooHigh'),
        t('investmentTooHigh'),
        [{ text: 'OK' }]
      );
      return;
    }
    
    addProject({
      name,
      targetAmount: parseFloat(targetAmount),
      monthlyInvestment: parseFloat(monthlyInvestment),
      numberOfMonths: parseInt(numberOfMonths),
      color: selectedColor,
      icon: selectedIcon,
      deadline: hasDeadline ? deadlineDate.toISOString() : undefined,
    });
    
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: t('addProject'),
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t('addNewProject')}</Text>
        <Text style={styles.subtitle}>
          {t('trackYourFinancialGoals')}
        </Text>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('projectName')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('enterProjectName')}
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('targetAmount')}</Text>
            <TextInput
              style={styles.input}
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('numberOfMonths')}</Text>
            <TextInput
              style={styles.input}
              value={numberOfMonths}
              onChangeText={setNumberOfMonths}
              placeholder="12"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('monthlyInvestment')}</Text>
            <View>
              <TextInput
                style={[
                  styles.input,
                  !isFeasible && styles.inputWarning
                ]}
                value={monthlyInvestment}
                editable={false}
                placeholder="0.00"
                placeholderTextColor={colors.textLight}
              />
              
              {!isFeasible && (
                <View style={styles.warningContainer}>
                  <AlertCircle size={16} color={colors.danger} />
                  <Text style={styles.warningText}>{t('investmentTooHigh')}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('projectColor')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorsContainer}
            >
              {projectColors.map((color, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Check size={16} color={colors.white} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('projectIcon')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconsContainer}
            >
              {projectIcons.map((icon, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.iconOptionSelected,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.deadlineHeader}>
              <Text style={styles.label}>{t('deadline')}</Text>
              <Pressable
                style={[
                  styles.deadlineToggle,
                  hasDeadline && styles.deadlineToggleActive,
                ]}
                onPress={() => setHasDeadline(!hasDeadline)}
              >
                <Text
                  style={[
                    styles.deadlineToggleText,
                    hasDeadline && styles.deadlineToggleTextActive,
                  ]}
                >
                  {hasDeadline ? t('enabled') : t('disabled')}
                </Text>
              </Pressable>
            </View>
            
            {hasDeadline && (
              <Pressable 
                style={styles.dateButton}
                onPress={() => {
                  // In a real app, show a date picker here
                  // For this demo, we'll just use the calculated date based on number of months
                  const newDate = new Date();
                  newDate.setMonth(newDate.getMonth() + parseInt(numberOfMonths || '12'));
                  setDeadlineDate(newDate);
                }}
              >
                <Calendar size={20} color={colors.textLight} />
                <Text style={styles.dateButtonText}>
                  {deadlineDate.toLocaleDateString()}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        
        <Pressable
          style={[
            styles.addButton,
            (!name || !targetAmount || parseFloat(targetAmount) <= 0 || !numberOfMonths || parseInt(numberOfMonths) <= 0 || !isFeasible) && 
              styles.addButtonDisabled,
          ]}
          onPress={handleAddProject}
          disabled={!name || !targetAmount || parseFloat(targetAmount) <= 0 || !numberOfMonths || parseInt(numberOfMonths) <= 0 || !isFeasible}
        >
          <Check size={20} color={colors.white} />
          <Text style={styles.addButtonText}>{t('createProject')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWarning: {
    borderColor: colors.danger,
    color: colors.danger,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.danger,
    marginLeft: 8,
  },
  colorsContainer: {
    paddingVertical: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: colors.white,
  },
  iconsContainer: {
    paddingVertical: 8,
  },
  iconOption: {
    width: 60,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  iconText: {
    fontSize: 12,
    color: colors.text,
  },
  deadlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deadlineToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  deadlineToggleText: {
    fontSize: 14,
    color: colors.text,
  },
  deadlineToggleTextActive: {
    color: colors.white,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});