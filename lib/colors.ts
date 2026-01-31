/**
 * ============================================================================
 * TADA Credit - Theme Utilities
 * ============================================================================
 * 
 * File này chứa các utilities hỗ trợ cho theme system.
 * CSS Variables được định nghĩa trong globals.css làm nguồn chính.
 * File này cung cấp TypeScript utilities để sử dụng trong components.
 * 
 * Usage:
 * import { cn } from '@/lib/utils';
 * import { theme, statusVariants } from '@/lib/colors';
 * 
 * <div className={cn(theme.card.base, theme.card.hover)} />
 * <span className={statusVariants.active} />
 * 
 * ============================================================================
 */

// ============================================================================
// THEME TYPE
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

// ============================================================================
// TAILWIND CLASS COMPOSITIONS
// ============================================================================

/**
 * Pre-composed Tailwind classes cho các pattern thường dùng.
 * Sử dụng CSS variables từ globals.css để đảm bảo theme-aware.
 */
export const theme = {
  // ─── Text Styles ───
  text: {
    // Primary text - main content
    primary: 'text-foreground',
    // Secondary text - supporting content
    secondary: 'text-muted-foreground',
    // Muted text - less emphasis (alias for secondary)
    muted: 'text-muted-foreground',
    // Inverse text - on dark backgrounds
    inverse: 'text-primary-foreground',
    // Link styles
    link: 'text-primary hover:text-primary/80 transition-colors',
    // Semantic colors
    destructive: 'text-destructive',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    // Gradient text
    gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60',
  },

  // ─── Background Styles ───
  bg: {
    // Page background
    page: 'bg-background',
    // Card/surface background
    card: 'bg-card',
    // Muted/subtle background
    muted: 'bg-muted',
    // Secondary background
    secondary: 'bg-secondary',
    // Accent background (hover states)
    accent: 'bg-accent',
    // Overlay with blur
    overlay: 'bg-background/80 backdrop-blur-sm',
    // Subtle variant
    subtle: 'bg-muted/50',
  },

  // ─── Border Styles ───
  border: {
    // Default border
    default: 'border border-border',
    // Subtle border
    subtle: 'border border-border/50',
    // Interactive border (changes on hover)
    interactive: 'border border-border hover:border-primary/50 transition-colors',
    // Focus state
    focus: 'focus:border-ring focus:ring-ring/50 focus:ring-2',
  },

  // ─── Card Compositions ───
  card: {
    // Base card
    base: 'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
    // Card with hover effect
    hover: 'hover:shadow-lg hover:border-border transition-all duration-300',
    // Glass morphism card
    glass: 'rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm text-card-foreground shadow-lg',
    // Interactive card (clickable)
    interactive: 'rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer',
  },

  // ─── Button Compositions ───
  button: {
    base: 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg',
    link: 'text-primary underline-offset-4 hover:underline',
  },

  // ─── Input Compositions ───
  input: {
    base: 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    // With glass effect
    glass: 'w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  },

  // ─── Layout Compositions ───
  layout: {
    // Page container
    page: 'min-h-screen bg-background',
    // Page with subtle gradient
    pageGradient: 'min-h-screen bg-gradient-to-br from-background via-background to-muted/20',
    // Header/navbar
    header: 'border-b border-border bg-card/80 backdrop-blur-sm',
    // Sidebar
    sidebar: 'border-r border-border bg-card',
    // Footer
    footer: 'border-t border-border bg-muted/50',
    // Main content area
    main: 'container mx-auto px-4 py-8',
    // Centered content
    center: 'flex items-center justify-center min-h-screen',
  },

  // ─── Badge Compositions ───
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    info: 'bg-info text-info-foreground',
  },

  // ─── Alert Compositions ───
  alert: {
    base: 'relative w-full rounded-lg border p-4',
    default: 'bg-background text-foreground border-border',
    destructive: 'bg-destructive/10 text-destructive border-destructive/50 dark:bg-destructive/20',
    success: 'bg-success/10 text-success border-success/50 dark:bg-success/20',
    warning: 'bg-warning/10 text-warning border-warning/50 dark:bg-warning/20',
    info: 'bg-info/10 text-info border-info/50 dark:bg-info/20',
  },
} as const;

// ============================================================================
// STATUS VARIANTS
// ============================================================================

/**
 * Status-specific styling cho badges, indicators, etc.
 * Tự động adapt theo light/dark theme.
 */
export const statusVariants = {
  active: 'bg-success/10 text-success border-success/30',
  pending: 'bg-warning/10 text-warning border-warning/30',
  inactive: 'bg-muted text-muted-foreground border-border',
  error: 'bg-destructive/10 text-destructive border-destructive/30',
  info: 'bg-info/10 text-info border-info/30',
} as const;

// ============================================================================
// ANIMATION CLASSES
// ============================================================================

export const animations = {
  // Fade in
  fadeIn: 'animate-in fade-in duration-300',
  // Slide up
  slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
  // Slide down
  slideDown: 'animate-in slide-in-from-top-4 duration-300',
  // Scale
  scale: 'animate-in zoom-in-95 duration-200',
  // Spin (for loaders)
  spin: 'animate-spin',
  // Pulse (for skeletons)
  pulse: 'animate-pulse',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  theme,
  statusVariants,
  animations,
};
