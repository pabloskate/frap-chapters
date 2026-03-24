import { createContext } from 'react';

export type PinLocation = 'sidebar' | 'homepage';

export interface PinnedItem {
  id: string;
  location: PinLocation;
}

export interface PinnedFeaturesValue {
  pinnedItems: PinnedItem[];
  sidebarIds: string[];
  homepageIds: string[];
  pinFeature: (id: string, location: PinLocation) => void;
  unpinFeature: (id: string, location?: PinLocation) => void;
  movePin: (id: string, from: PinLocation, to: PinLocation) => void;
  isPinned: (id: string, location?: PinLocation) => boolean;
  getPinLocation: (id: string) => PinLocation | null;
}

export const PinnedFeaturesContext = createContext<PinnedFeaturesValue | null>(null);
