import { css } from 'remix/component';

export const tokens = {
  background: 'var(--reai-background, #ffffff)',
  foreground: 'var(--reai-foreground, #171717)',
  muted: 'var(--reai-muted, #f5f5f5)',
  subtle: 'var(--reai-subtle, #737373)',
  border: 'var(--reai-border, #e5e5e5)',
  primary: 'var(--reai-primary, #171717)',
  primaryForeground: 'var(--reai-primary-foreground, #fafafa)',
  destructive: 'var(--reai-destructive, #b91c1c)',
  ring: 'var(--reai-ring, #a3a3a3)',
  radius: 'var(--reai-radius, 16px)',
} as const;

export const lightTheme = css({
  colorScheme: 'light',
  '--reai-background': '#ffffff',
  '--reai-foreground': '#171717',
  '--reai-muted': '#f5f5f5',
  '--reai-subtle': '#737373',
  '--reai-border': '#e5e5e5',
  '--reai-primary': '#171717',
  '--reai-primary-foreground': '#fafafa',
  '--reai-destructive': '#b91c1c',
  '--reai-ring': '#a3a3a3',
});

export const darkTheme = css({
  colorScheme: 'dark',
  '--reai-background': '#171717',
  '--reai-foreground': '#fafafa',
  '--reai-muted': '#262626',
  '--reai-subtle': '#a3a3a3',
  '--reai-border': '#404040',
  '--reai-primary': '#fafafa',
  '--reai-primary-foreground': '#171717',
  '--reai-destructive': '#fca5a5',
  '--reai-ring': '#737373',
});
