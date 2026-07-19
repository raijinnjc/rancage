/**
 * RANCAGE Routing & Navigation Types
 */

export type ScreenId =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'diagnosis'
  | 'typology'
  | 'regional-profile'
  | 'household'
  | 'recommendation'
  | 'monitoring'
  | 'administration'
  | 'settings'
  | 'ml-evaluation';

export interface BreadcrumbItem {
  label: string;
  screenId?: ScreenId;
  active?: boolean;
}

export interface NavigationItem {
  id: ScreenId;
  label: string;
  icon: string;
  minRole: 'PUBLIC' | 'GOVERNMENT' | 'ADMIN';
  description: string;
}
