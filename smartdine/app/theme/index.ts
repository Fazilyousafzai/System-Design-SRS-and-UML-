// theme/index.ts
export const Colors = {
  // Brand
  gold: '#C9A96E',
  goldLight: '#E8C98A',
  goldDark: '#A07840',

  // Dark theme
  dark: {
    bg: '#0D0D0D',
    bgCard: '#1A1A1A',
    bgElevated: '#242424',
    surface: '#2A2A2A',
    border: '#333333',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textMuted: '#666666',
  },

  // Light theme
  light: {
    bg: '#F8F5F0',
    bgCard: '#FFFFFF',
    bgElevated: '#F0EDE8',
    surface: '#FFFFFF',
    border: '#E5E0D8',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#AAAAAA',
  },

  // Semantic
  success: '#4CAF50',
  error: '#EF5350',
  warning: '#FF9800',
  info: '#2196F3',

  // Status
  available: '#4CAF50',
  occupied: '#EF5350',
  reserved: '#FF9800',
};

export const Fonts = {
  heading: 'serif',   // Will be replaced with custom font
  body: 'System',
  mono: 'monospace',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: '#C9A96E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const getTheme = (isDark: boolean) => ({
  colors: isDark ? Colors.dark : Colors.light,
  isDark,
});