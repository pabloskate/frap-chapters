import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { FEATURE_CATALOG } from '../data/featureCatalog';

const pinnedFeaturesStorageKey = 'profitAcademy.pinnedFeatureIds';

const validFeatureIds = new Set(FEATURE_CATALOG.map((f) => f.id));

function loadPinnedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(pinnedFeaturesStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string => typeof id === 'string' && validFeatureIds.has(id),
    );
  } catch {
    return [];
  }
}

function savePinnedIds(ids: string[]) {
  try {
    window.localStorage.setItem(pinnedFeaturesStorageKey, JSON.stringify(ids));
  } catch {
    // Ignore storage failures
  }
}

interface PinnedFeaturesValue {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  removePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

const PinnedFeaturesContext = createContext<PinnedFeaturesValue | null>(null);

export function PinnedFeaturesProvider({ children }: { children: ReactNode }) {
  const [pinnedIds, setPinnedIds] = useState<string[]>(loadPinnedIds);

  useEffect(() => {
    savePinnedIds(pinnedIds);
  }, [pinnedIds]);

  const togglePin = useCallback((id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const removePin = useCallback((id: string) => {
    setPinnedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const isPinned = useCallback(
    (id: string) => pinnedIds.includes(id),
    [pinnedIds],
  );

  return (
    <PinnedFeaturesContext.Provider
      value={{ pinnedIds, togglePin, removePin, isPinned }}
    >
      {children}
    </PinnedFeaturesContext.Provider>
  );
}

export function usePinnedFeatures() {
  const context = useContext(PinnedFeaturesContext);

  if (!context) {
    throw new Error(
      'usePinnedFeatures must be used within PinnedFeaturesProvider',
    );
  }

  return context;
}
