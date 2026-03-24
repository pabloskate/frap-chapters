import { useContext } from 'react';
import { PinnedFeaturesContext } from './pinnedFeaturesContext';

export function usePinnedFeatures() {
  const context = useContext(PinnedFeaturesContext);

  if (!context) {
    throw new Error('usePinnedFeatures must be used within PinnedFeaturesProvider');
  }

  return context;
}
