/**
 * RANCAGE Routing & Navigation Types
 */

export type ScreenId =
  | 'landing'
  | 'exploration'
  | 'methodology'
  | 'login'
  | 'dashboard'
  | 'household'
  | 'ml-evaluation'
  | 'recommendation'
  | 'monitoring'
  | 'settings';

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
