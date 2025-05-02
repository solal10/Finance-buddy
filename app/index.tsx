import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

export default function LandingPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FinTrack</Text>
          <Text style={styles.subtitle}>Your personal finance companion</Text>
          <Text style={styles.description}>
            Track expenses, manage budgets, and achieve your financial goals with ease
          </Text>
        </View>

        <View style={styles.actions}>
          <Link href="/register" asChild>
            <Pressable style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Get Started</Text>
            </Pressable>
          </Link>

          <Link href="/login" asChild>
            <Pressable style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
  actions: {
    gap: 12,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  loginButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
});