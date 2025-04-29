import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { BarChart3, CreditCard, Home, PieChart, Settings } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function TabLayout() {
  const { t } = useTranslation();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'),
          tabBarLabel: t('dashboard'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: t('transactions'),
          tabBarLabel: t('transactions'),
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t('reports'),
          tabBarLabel: t('reports'),
          tabBarIcon: ({ color }) => <PieChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: t('budget'),
          tabBarLabel: t('budget'),
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarLabel: t('settings'),
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}