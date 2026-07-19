/**
 * RANCAGE Theme Types
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  highContrast: boolean;
}
