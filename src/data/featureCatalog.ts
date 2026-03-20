export type FeatureCategory =
  | 'Onboarding'
  | 'Education'
  | 'Chapter'
  | 'Tools';

export interface FeatureCatalogEntry {
  id: string;
  label: string;
  description: string;
  category: FeatureCategory;
  /** Route for React Router; omitted when opening chat instead */
  href?: string;
  navKind: 'link' | 'chat';
}

export const FEATURE_CATEGORY_ORDER: FeatureCategory[] = [
  'Onboarding',
  'Education',
  'Chapter',
  'Tools',
];

export const FEATURE_CATALOG: FeatureCatalogEntry[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Dashboard and chapter overview',
    category: 'Chapter',
    href: '/',
    navKind: 'link',
  },
  {
    id: 'onboarding-course',
    label: 'Onboarding — Course',
    description: 'Core FRAP onboarding curriculum',
    category: 'Onboarding',
    href: '/onboarding',
    navKind: 'link',
  },
  {
    id: 'onboarding-implementation',
    label: 'Onboarding — Implementation',
    description: 'Implementation track and next steps',
    category: 'Onboarding',
    href: '/onboarding/implementation',
    navKind: 'link',
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Learning resources and materials',
    category: 'Education',
    href: '/education',
    navKind: 'link',
  },
  {
    id: 'dashboard',
    label: 'Chapter Roster',
    description: 'View and manage chapter members',
    category: 'Chapter',
    href: '/dashboard',
    navKind: 'link',
  },
  {
    id: 'chat',
    label: 'Chapter Chat',
    description: 'Open the chapter chat panel',
    category: 'Chapter',
    navKind: 'chat',
  },
  {
    id: 'board',
    label: 'Swap Board',
    description: 'Track swaps on the kanban board',
    category: 'Chapter',
    href: '/board',
    navKind: 'link',
  },
  {
    id: 'nationwide-wins',
    label: 'Nationwide Wins',
    description: 'Wins and highlights across chapters',
    category: 'Chapter',
    href: '/nationwide-wins',
    navKind: 'link',
  },
  {
    id: 'insights',
    label: 'Avatar Intelligence',
    description: 'Insights and compatibility for your roster',
    category: 'Chapter',
    href: '/insights',
    navKind: 'link',
  },
  {
    id: 'manage',
    label: 'Manage Chapter',
    description: 'Chapter settings and administration',
    category: 'Chapter',
    href: '/manage',
    navKind: 'link',
  },
  {
    id: 'generator',
    label: 'Swap Content Generator',
    description: 'Generate swap outreach content',
    category: 'Tools',
    href: '/generator',
    navKind: 'link',
  },
];

const byId = new Map(
  FEATURE_CATALOG.map((entry) => [entry.id, entry] as const),
);

export function getFeatureById(id: string): FeatureCatalogEntry | undefined {
  return byId.get(id);
}
