import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { SwapItem } from '../types';

export interface AppStateValue {
  onboardingComplete: boolean;
  setOnboardingComplete: Dispatch<SetStateAction<boolean>>;
  swaps: SwapItem[];
  setSwaps: Dispatch<SetStateAction<SwapItem[]>>;
}

export const AppStateContext = createContext<AppStateValue | null>(null);
