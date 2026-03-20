import type { ReactNode } from 'react';

export type SidebarKey =
  | 'home'
  | 'onboarding'
  | 'onboardingImplementation'
  | 'education'
  | 'dashboard'
  | 'nationwideWins'
  | 'chat'
  | 'board'
  | 'manage'
  | 'insights'
  | 'allFeatures';

export type NavVariant = 'chapter' | 'withInsights' | 'generator';

export type SwapTypeId =
  | 'email'
  | 'social'
  | 'newsletter'
  | 'interview'
  | 'facebook-group'
  | 'thankyou'
  | 'mail';

export type SwapStatus = 'assigned' | 'in-progress' | 'done';

export interface PartnerInfo {
  contact: string;
  phone: string;
  email: string;
  website: string;
  services: string;
}

export interface Member {
  name: string;
  business: string;
  photo: string;
}

export interface DashboardRosterMember extends Member {
  reverseSwapIcon?: boolean;
}

export interface SwapTypeDefinition {
  id: SwapTypeId;
  label: string;
}

export interface SwapItem {
  id: string;
  from: string;
  fromBiz: string;
  to: string;
  toBiz: string;
  type: SwapTypeId;
  status: SwapStatus;
  month: number;
  year: number;
  /** Kanban column order within the same month/year (persisted with swaps). */
  boardOrder?: number;
}

export interface PairingSuggestion {
  from: string;
  fromBiz: string;
  to: string;
  toBiz: string;
  type: SwapTypeId;
  score: number;
  reason: string;
}

export interface CompatibilityScore {
  score: number;
  factors: string[];
  suggestedType: SwapTypeId;
}

export interface InsightAction {
  label: string;
  type: SwapTypeId;
  primary?: boolean;
}

export interface InsightCardData {
  name: string;
  business: string;
  photo: string;
  score: string;
  scoreLabel: string;
  medium?: boolean;
  factors: Array<{ label: string; match?: boolean; warning?: boolean }>;
  actions: InsightAction[];
}

export interface ChatMessage {
  author: string;
  time: string;
  text: string;
  avatar: string;
  own?: boolean;
}

export interface SwapMenuItem {
  type: SwapTypeId;
  title: string;
  description: string;
  badge?: {
    label: string;
    tone: 'best' | 'high';
  };
}

export interface SwapMenuSection {
  title: string;
  items: SwapMenuItem[];
}

export interface SwapTypeIconProps {
  className?: string;
  height?: number;
  strokeWidth?: number | string;
  width?: number;
}

export interface GeneratedContentProps {
  partner: string;
  onCopyEmailSubject: () => void;
  onCopyEmailSubjectDone: boolean;
}

export interface GeneratorTypeOption {
  type: SwapTypeId;
  content: ReactNode;
}
