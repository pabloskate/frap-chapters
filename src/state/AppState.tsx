import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { defaultSwaps, onboardingStorageKey, swapsStorageKey } from '../data';
import type { SwapItem } from '../types';

interface AppStateValue {
  onboardingComplete: boolean;
  setOnboardingComplete: Dispatch<SetStateAction<boolean>>;
  swaps: SwapItem[];
  setSwaps: Dispatch<SetStateAction<SwapItem[]>>;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function loadOnboardingComplete() {
  try {
    return window.localStorage.getItem(onboardingStorageKey) === 'true';
  } catch {
    return false;
  }
}

function loadSwaps() {
  try {
    const storedValue = window.localStorage.getItem(swapsStorageKey);
    if (!storedValue) {
      return [...defaultSwaps];
    }

    const parsedValue = JSON.parse(storedValue) as SwapItem[];
    return parsedValue.map((swap) => ({
      ...swap,
      month: swap.month ?? 2,
      year: swap.year ?? 2026,
    }));
  } catch {
    return [...defaultSwaps];
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [onboardingComplete, setOnboardingComplete] = useState(
    loadOnboardingComplete,
  );
  const [swaps, setSwaps] = useState<SwapItem[]>(loadSwaps);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        onboardingStorageKey,
        String(onboardingComplete),
      );
    } catch {
      // Ignore prototype storage failures.
    }
  }, [onboardingComplete]);

  useEffect(() => {
    try {
      window.localStorage.setItem(swapsStorageKey, JSON.stringify(swaps));
    } catch {
      // Ignore prototype storage failures.
    }
  }, [swaps]);

  return (
    <AppStateContext.Provider
      value={{ onboardingComplete, setOnboardingComplete, swaps, setSwaps }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }

  return context;
}
