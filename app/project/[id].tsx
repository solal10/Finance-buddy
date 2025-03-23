import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFinanceStore, useProjects, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/format';
import { Calendar, Check, Edit2, Plus, Trash2 } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  
  const projects = useProjects();
  const profile = useProfile();
  const contributeToProject = useFinanceStore((state) => state.contributeToProject);
  const deleteProject = useFinanceStore((state) => state.deleteProject);
  
  const project = projects.find((p) => p.id === id);
  
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  
  const handleContribute = () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      return;
    }
    
    contributeToProject(id as string, parseFloat(contributionAmount));
    setContributionAmount('');
    setIsContributing(false);
  };
  
  const handleDelete = () => {
    Alert.alert(
      t('deleteProject'),
      t('deleteProjectWarning'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: () => {
            if (project) {
              deleteProject(project.id);
              router.back();
            }
          }
        },
      ]
    );
  };
  
  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: t('projectDetails') }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t('projectNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const progress = project.currentAmount / project.targetAmount;
  const percentage = Math.min(Math.round(progress * 100), 100);
  const remaining = project.targetAmount - project.currentAmount;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: project.name,
          headerRight: () => (
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Trash2 size={20} color={colors.danger} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView>
        <View style={styles.header}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: project.color }
            ]}
          >
            <Text style={styles.iconText}>{project.icon}</Text>
          </View>
          
          <Text style={styles.projectName}>{project.name}</Text>
          
          <View style={styles.amountsContainer}>
            <Text style={styles.currentAmount}>
              {formatCurrency(project.currentAmount, profile.currency)}
            </Text>
            <Text style={styles.targetAmount}>
              / {formatCurrency(project.targetAmount, profile.currency)}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>{t('progress')}</Text>
            <Text style={styles.progressPercentage}>{percentage}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${percentage}%`, backgroundColor: project.color }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.progressDetails}>
            <View style={styles.progressDetailItem}>
              <Text style={styles.progressDetailLabel}>{t('saved')}</Text>
              <Text style={styles.progressDetailValue}>
                {formatCurrency(project.currentAmount, profile.currency)}
              </Text>
            </View>
            
            <View style={styles.progressDetailItem}>
              <Text style={styles.progressDetailLabel}>{t('remaining')}</Text>
              <Text style={styles.progressDetailValue}>
                {formatCurrency(remaining, profile.currency)}
              </Text>
            </View>
          </View>
        </View>
        
        {project.deadline && (
          <View style={styles.deadlineCard}>
            <View style={styles.deadlineHeader}>
              <Calendar size={20} color={colors.textLight} />
              <Text style={styles.deadlineTitle}>{t('deadline')}</Text>
            </View>
            <Text style={styles.deadlineDate}>
              {formatDate(project.deadline, profile.language)}
            </Text>
          </View>
        )}
        
        <View style={styles.contributionCard}>
          {isContributing ? (
            <View style={styles.contributionForm}>
              <Text style={styles.contributionTitle}>{t('addContribution')}</Text>
              <TextInput
                style={styles.contributionInput}
                value={contributionAmount}
                onChangeText={setContributionAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
                autoFocus
              />
              
              <View style={styles.contributionButtons}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsContributing(false);
                    setContributionAmount('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                </Pressable>
                
                <Pressable 
                  style={[
                    styles.confirmButton,
                    (!contributionAmount || parseFloat(contributionAmount) <= 0) && 
                      styles.confirmButtonDisabled,
                  ]}
                  onPress={handleContribute}
                  disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
                >
                  <Check size={18} color={colors.white} />
                  <Text style={styles.confirmButtonText}>{t('confirm')}</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable 
              style={styles.contributeButton}
              onPress={() => setIsContributing(true)}
            >
              <Plus size={20} color={colors.white} />
              <Text style={styles.contributeButtonText}>{t('addContribution')}</Text>
            </Pressable>
          )}
        </View>
        
        <View style={styles.actions}>
          <Pressable 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              // In a real app, navigate to edit screen
              Alert.alert(t('editProject'), t('editProjectFeature'));
            }}
          >
            <Edit2 size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>{t('editProject')}</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, styles.deleteButtonFull]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>{t('deleteProject')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 24,
    color: colors.white,
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  targetAmount: {
    fontSize: 18,
    color: colors.textLight,
    marginLeft: 4,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressDetailItem: {
    alignItems: 'flex-start',
  },
  progressDetailLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  progressDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  deadlineCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  deadlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  deadlineDate: {
    fontSize: 18,
    color: colors.text,
  },
  contributionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  contributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  contributeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contributionForm: {
    
  },
  contributionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  contributionInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    color: colors.text,
    marginBottom: 16,
  },
  contributionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.border,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actions: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButtonFull: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textLight,
  },
});