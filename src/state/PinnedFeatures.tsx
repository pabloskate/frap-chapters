import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { FEATURE_CATALOG } from '../data/featureCatalog';

export type PinLocation = 'sidebar' | 'homepage';

export interface PinnedItem {
  id: string;
  location: PinLocation;
}

const pinnedFeaturesStorageKey = 'profitAcademy.pinnedFeatures';

const validFeatureIds = new Set(FEATURE_CATALOG.map((f) => f.id));

function loadPinnedItems(): PinnedItem[] {
  try {
    const raw = window.localStorage.getItem(pinnedFeaturesStorageKey);
    if (!raw) {
      // Migration: try to load from old format
      const oldRaw = window.localStorage.getItem('profitAcademy.pinnedFeatureIds');
      if (oldRaw) {
        try {
          const oldParsed = JSON.parse(oldRaw) as unknown;
          if (Array.isArray(oldParsed)) {
            const migrated = oldParsed
              .filter((id): id is string => typeof id === 'string' && validFeatureIds.has(id))
              .map((id) => ({ id, location: 'sidebar' as PinLocation }));
            return migrated;
          }
        } catch {
          // Ignore old format errors
        }
      }
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is PinnedItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as PinnedItem).id === 'string' &&
        typeof (item as PinnedItem).location === 'string' &&
        validFeatureIds.has((item as PinnedItem).id) &&
        ['sidebar', 'homepage'].includes((item as PinnedItem).location),
    );
  } catch {
    return [];
  }
}

function savePinnedItems(items: PinnedItem[]) {
  try {
    window.localStorage.setItem(pinnedFeaturesStorageKey, JSON.stringify(items));
  } catch {
    // Ignore storage failures
  }
}

interface PinnedFeaturesValue {
  pinnedItems: PinnedItem[];
  sidebarIds: string[];
  homepageIds: string[];
  pinFeature: (id: string, location: PinLocation) => void;
  unpinFeature: (id: string, location?: PinLocation) => void;
  movePin: (id: string, from: PinLocation, to: PinLocation) => void;
  isPinned: (id: string, location?: PinLocation) => boolean;
  getPinLocation: (id: string) => PinLocation | null;
}

const PinnedFeaturesContext = createContext<PinnedFeaturesValue | null>(null);

export function PinnedFeaturesProvider({ children }: { children: ReactNode }) {
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(loadPinnedItems);

  useEffect(() => {
    savePinnedItems(pinnedItems);
  }, [pinnedItems]);

  const sidebarIds = pinnedItems
    .filter((item) => item.location === 'sidebar')
    .map((item) => item.id);

  const homepageIds = pinnedItems
    .filter((item) => item.location === 'homepage')
    .map((item) => item.id);

  const pinFeature = useCallback((id: string, location: PinLocation) => {
    setPinnedItems((prev) => {
      // Remove any existing pin for this id
      const filtered = prev.filter((item) => item.id !== id);
      // Add new pin with location
      return [...filtered, { id, location }];
    });
  }, []);

  const unpinFeature = useCallback((id: string, location?: PinLocation) => {
    setPinnedItems((prev) => {
      if (location) {
        return prev.filter((item) => !(item.id === id && item.location === location));
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const movePin = useCallback((id: string, from: PinLocation, to: PinLocation) => {
    setPinnedItems((prev) =>
      prev.map((item) => (item.id === id && item.location === from ? { ...item, location: to } : item)),
    );
  }, []);

  const isPinned = useCallback(
    (id: string, location?: PinLocation) => {
      if (location) {
        return pinnedItems.some((item) => item.id === id && item.location === location);
      }
      return pinnedItems.some((item) => item.id === id);
    },
    [pinnedItems],
  );

  const getPinLocation = useCallback(
    (id: string): PinLocation | null => {
      const item = pinnedItems.find((item) => item.id === id);
      return item?.location ?? null;
    },
    [pinnedItems],
  );

  return (
    <PinnedFeaturesContext.Provider
      value={{
        pinnedItems,
        sidebarIds,
        homepageIds,
        pinFeature,
        unpinFeature,
        movePin,
        isPinned,
        getPinLocation,
      }}
    >
      {children}
    </PinnedFeaturesContext.Provider>
  );
}

export function usePinnedFeatures() {
  const context = useContext(PinnedFeaturesContext);

  if (!context) {
    throw new Error('usePinnedFeatures must be used within PinnedFeaturesProvider');
  }

  return context;
}
