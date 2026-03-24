import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { AppStateContext } from './appStateContext';
import { defaultSwaps, onboardingStorageKey, swapsStorageKey } from '../data';
import type { SwapItem } from '../types';

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
