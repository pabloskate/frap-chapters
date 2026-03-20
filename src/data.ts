import type {
  ChatMessage,
  CompatibilityScore,
  DashboardRosterMember,
  InsightCardData,
  Member,
  PairingSuggestion,
  PartnerInfo,
  SwapItem,
  SwapMenuSection,
  SwapTypeDefinition,
  SwapTypeId,
} from './types';
import chapterData from './data/chapter-data.json';

export const onboardingStorageKey = 'onboardingComplete';
export const swapsStorageKey = 'frapChapterSwaps';

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const chapterMembers: Member[] = chapterData.members.map(
  ({ name, business, photo }) => ({ name, business, photo }),
);
export const chapterMemberCount = chapterMembers.length;
export const defaultPartnerBusiness = chapterMembers[0]?.business ?? '';

export const dashboardRosterMembers: DashboardRosterMember[] = chapterData.members.map(
  (member) => ({
    name: member.name,
    business: member.business,
    photo: member.photo,
    ...(member.reverseSwapIcon ? { reverseSwapIcon: true as const } : {}),
  }),
);

export const swapTypes: SwapTypeDefinition[] = [
  { id: 'email', label: 'Email Swap' },
  { id: 'social', label: 'Social Shoutout' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'interview', label: 'Interview Swap' },
  { id: 'facebook-group', label: 'Facebook Group' },
  { id: 'thankyou', label: 'Thank You Page' },
  { id: 'mail', label: 'Direct Mail' },
];

export const generatorTypeNames: Record<SwapTypeId, string> = {
  email: 'Email Swap',
  interview: 'Interview Swap',
  social: 'Social Shoutout',
  'facebook-group': 'Facebook Group Post',
  mail: 'Direct Mail',
  newsletter: 'Newsletter',
  thankyou: 'Thank You Page',
};

export const swapMenuSections: SwapMenuSection[] = [
  {
    title: 'Digital Swaps',
    items: [
      {
        type: 'email',
        title: 'Email Swap',
        description: 'Send to your email list promoting a partner',
        badge: { label: 'Best Match', tone: 'best' },
      },
      {
        type: 'social',
        title: 'Social Shoutout',
        description: 'Quick social post to promote a partner',
      },
      {
        type: 'newsletter',
        title: 'Newsletter',
        description: 'Full newsletter with partner spotlights',
      },
    ],
  },
  {
    title: 'Live & Community',
    items: [
      {
        type: 'interview',
        title: 'Interview Swap',
        description: 'Facebook Live interview questions',
      },
      {
        type: 'facebook-group',
        title: 'Facebook Group',
        description: 'Community recommendation post',
      },
    ],
  },
  {
    title: 'Website & Print',
    items: [
      {
        type: 'thankyou',
        title: 'Thank You Page',
        description: 'Post-form page with partner offer',
        badge: { label: 'High Match', tone: 'high' },
      },
      {
        type: 'mail',
        title: 'Direct Mail',
        description: 'Shared postcard or flyer',
      },
    ],
  },
];

export const defaultSwaps: SwapItem[] = chapterData.defaultSwaps as SwapItem[];

export const memberScores: Record<string, Record<string, CompatibilityScore>> =
  chapterData.memberScores as Record<string, Record<string, CompatibilityScore>>;

export const suggestedPairings: PairingSuggestion[] =
  chapterData.suggestedPairings as PairingSuggestion[];

export const partnerData: Record<string, PartnerInfo> = chapterData.partnerData as Record<
  string,
  PartnerInfo
>;
export const chatMessagesSeed: ChatMessage[] = chapterData.chatMessagesSeed as ChatMessage[];
export const insightCards: InsightCardData[] = chapterData.insightCards as InsightCardData[];

export function getSwapTypeLabel(type: SwapTypeId) {
  return swapTypes.find((swapType) => swapType.id === type)?.label ?? type;
}

export function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
