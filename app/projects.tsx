import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useProjects, useProfile } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import { Plus } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function ProjectsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const projects = useProjects();
  const profile = useProfile();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: t('projects'),
          headerShadowVisible: false,
        }} 
      />
      
      {projects.length > 0 ? (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const progress = item.currentAmount / item.targetAmount;
            const percentage = Math.min(Math.round(progress * 100), 100);
            
            return (
              <Pressable 
                style={styles.projectCard}
                onPress={() => router.push(`/project/${item.id}`)}
              >
                <View style={styles.projectHeader}>
                  <View 
                    style={[
                      styles.projectIcon, 
                      { backgroundColor: item.color }
                    ]}
                  >
                    <Text style={styles.iconText}>{item.icon}</Text>
                  </View>
                  
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>{item.name}</Text>
                    {item.deadline && (
                      <Text style={styles.deadline}>
                        {t('deadline')}: {new Date(item.deadline).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.projectAmounts}>
                  <Text style={styles.currentAmount}>
                    {formatCurrency(item.currentAmount, profile.currency)}
                  </Text>
                  <Text style={styles.targetAmount}>
                    / {formatCurrency(item.targetAmount, profile.currency)}
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBackground}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: item.color }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{percentage}% {t('achieved')}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('noProjects')}</Text>
          <Text style={styles.emptyStateSubtext}>{t('addProjectsToTrack')}</Text>
        </View>
      )}
      
      <Pressable 
        style={styles.addButton}
        onPress={() => router.push('/add-project')}
      >
        <Plus size={24} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
    color: colors.white,
  },
  projectInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  deadline: {
    fontSize: 14,
    color: colors.textLight,
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
    marginBottom: 4,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});