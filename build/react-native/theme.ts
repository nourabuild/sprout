/**
 * Do not edit directly, this file was auto-generated.
 */

export const theme = {
  colors: {
    light: {
      brand: "#00A3FF",
      text: "#0F172A",
      background: "#F8FAFC",
      surface: "#F1F5F9",
      selected: "#E2E8F0",
      textSecondary: "#64748B",
      success: {
        background: "#DCFCE7",
        text: "#16A34A",
      },
      warning: {
        background: "#FEF3C7",
        text: "#D97706",
      },
      error: {
        background: "#FEE2E2",
        text: "#DC2626",
      },
      info: {
        background: "#E0F4FF",
        text: "#00A3FF",
      },
    },
    dark: {
      brand: "#00A3FF",
      text: "#F8FAFC",
      background: "#0F172A",
      surface: "#1E293B",
      selected: "#334155",
      textSecondary: "#94A3B8",
      success: {
        background: "#166534",
      },
      warning: {
        background: "#78350F",
      },
      error: {
        background: "#991B1B",
      },
      info: {
        background: "#0369A1",
      },
    },
  },
  spacing: {
    s0: 0,
    s1: 4,
    s2: 8,
    s3: 12,
    s4: 16,
    s5: 24,
    s6: 32,
    s7: 48,
    s8: 64,
    screenPadding: 20,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
  },
  borderWidth: {
    thin: 1,
    standard: 2,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 13,
      md: 16,
      header: 18,
      lg: 20,
      xl: 24,
    },
    lineHeight: {
      xs: 16,
      sm: 18,
      md: 24,
      header: 24,
      lg: 28,
      xl: 32,
    },
  },
  icon: {
    sm: 16,
    md: 20,
    lg: 24,
  },
  component: {
    inputHeight: {
      sm: 40,
      md: 48,
      lg: 56,
    },
    buttonHeight: {
      sm: 40,
      md: 48,
      lg: 56,
    },
    avatar: {
      sm: 32,
      md: 48,
      lg: 72,
    },
  },
  zIndex: {
    base: 0,
    dropdown: 100,
    modal: 200,
    tooltip: 300,
    navbar: 400,
  },
  motion: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    spring: {
      gentle: {
        tension: 40,
        friction: 8,
      },
      snappy: {
        tension: 120,
        friction: 14,
      },
    },
  },
  opacity: {
    disabled: 0.5,
    pressed: 0.7,
    muted: 0.6,
  },
} as const;

export type Theme = typeof theme;
