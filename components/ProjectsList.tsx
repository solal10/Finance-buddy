import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useFinanceStore, useProjects, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/utils/i18n';

export default function ProjectsList() {
  const router = useRouter();
  const { t } = useTranslation();
  const projects = useProjects();
  const profile = useProfile();
  
  if (projects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('noProjects')}</Text>
        <Text style={styles.emptySubtext}>{t('addProjectsToTrack')}</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/add-project')}
        >
          <Plus size={18} color={colors.white} />
          <Text style={styles.addButtonText}>{t('addProject')}</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {projects.map((project) => {
          const progress = project.currentAmount / project.targetAmount;
          const percentage = Math.min(Math.round(progress * 100), 100);
          
          return (
            <Pressable 
              key={project.id}
              style={styles.projectCard}
              onPress={() => router.push(`/project/${project.id}`)}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View 
                  style={[
                    styles.projectIcon, 
                    { backgroundColor: project.color }
                  ]}
                />
              </View>
              
              <View style={styles.projectAmounts}>
                <Text style={styles.currentAmount}>
                  {formatCurrency(project.currentAmount, profile.currency)}
                </Text>
                <Text style={styles.targetAmount}>
                  / {formatCurrency(project.targetAmount, profile.currency)}
                </Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%`, backgroundColor: project.color }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{percentage}% {t('achieved')}</Text>
              </View>
              
              {project.deadline && (
                <Text style={styles.deadline}>
                  {t('deadline')}: {new Date(project.deadline).toLocaleDateString()}
                </Text>
              )}
            </Pressable>
          );
        })}
        
        <Pressable 
          style={styles.addProjectCard}
          onPress={() => router.push('/add-project')}
        >
          <View style={styles.addProjectContent}>
            <Plus size={32} color={colors.primary} />
            <Text style={styles.addProjectText}>{t('addNewProject')}</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  projectCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: 250,
    marginHorizontal: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  projectIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  projectAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  targetAmount: {
    fontSize: 16,
    color: colors.textLight,
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
  },
  deadline: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
  addProjectCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    width: 200,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addProjectContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addProjectText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});