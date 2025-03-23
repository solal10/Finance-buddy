// App color scheme
export const colors = {
  primary: '#6366f1', // Indigo
  primaryLight: '#818cf8',
  secondary: '#f97316', // Orange
  secondaryLight: '#fb923c',
  background: '#ffffff',
  card: '#f9fafb',
  text: '#1f2937',
  textLight: '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  dark: '#111827',
  white: '#ffffff',
};

// Category colors
export const categoryColors = {
  food: '#ef4444', // Red
  groceries: '#f97316', // Orange
  dining: '#f59e0b', // Amber
  utilities: '#10b981', // Emerald
  rent: '#3b82f6', // Blue
  transportation: '#8b5cf6', // Violet
  entertainment: '#ec4899', // Pink
  shopping: '#06b6d4', // Cyan
  health: '#14b8a6', // Teal
  education: '#6366f1', // Indigo
  travel: '#a855f7', // Purple
  personal: '#0ea5e9', // Sky
  other: '#64748b', // Slate
};

export default {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    tabIconDefault: colors.textLight,
    tabIconSelected: colors.primary,
    card: colors.card,
    border: colors.border,
  },
};