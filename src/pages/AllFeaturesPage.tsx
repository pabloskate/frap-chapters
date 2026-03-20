import { useMemo, useState, useRef, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/Layout';
import { useLayoutNav } from '../context/LayoutNavContext';
import {
  FEATURE_CATALOG,
  FEATURE_CATEGORY_ORDER,
  type FeatureCategory,
} from '../data/featureCatalog';
import { usePinnedFeatures, type PinLocation } from '../state/PinnedFeatures';

type TabKey = 'All' | FeatureCategory;

function matchesSearch(
  text: string,
  query: string,
): { match: boolean; highlight?: ReactNode } {
  const lower = text.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) {
    return { match: true };
  }

  const idx = lower.indexOf(q);
  if (idx === -1) {
    return { match: false };
  }

  return {
    match: true,
    highlight: (
      <>
        {text.slice(0, idx)}
        <mark className="all-features-highlight">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    ),
  };
}

interface PinDropdownProps {
  featureId: string;
  currentLocation: PinLocation | null;
  onPin: (location: PinLocation) => void;
  onUnpin: () => void;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

function PinDropdown({
  currentLocation,
  onPin,
  onUnpin,
  isOpen,
  onClose,
  triggerRef,
}: PinDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, above: false });

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    // Calculate position based on trigger button
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 120; // Approximate height of dropdown
    const gap = 6;

    // Check if dropdown would go off-screen below
    const wouldGoOffScreenBelow = rect.bottom + dropdownHeight + gap > window.innerHeight;

    setPosition({
      top: wouldGoOffScreenBelow ? rect.top - dropdownHeight - gap : rect.bottom + gap,
      left: rect.right - 160, // Align right edge of dropdown with right edge of button
      above: wouldGoOffScreenBelow,
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const isPinnedToSidebar = currentLocation === 'sidebar';
  const isPinnedToHomepage = currentLocation === 'homepage';

  return (
    <div
      ref={dropdownRef}
      className={`pin-dropdown ${position.above ? 'pin-dropdown--above' : ''}`}
      style={{ top: position.top, left: position.left }}
    >
      <div className="pin-dropdown-arrow" />
      <div className="pin-dropdown-header">Pin to:</div>
      <button
        type="button"
        className={`pin-dropdown-option ${isPinnedToSidebar ? 'is-active' : ''}`}
        onClick={() => {
          if (isPinnedToSidebar) {
            onUnpin();
          } else {
            onPin('sidebar');
          }
          onClose();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Sidebar</span>
        {isPinnedToSidebar && (
          <svg className="pin-dropdown-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <button
        type="button"
        className={`pin-dropdown-option ${isPinnedToHomepage ? 'is-active' : ''}`}
        onClick={() => {
          if (isPinnedToHomepage) {
            onUnpin();
          } else {
            onPin('homepage');
          }
          onClose();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Homepage</span>
        {isPinnedToHomepage && (
          <svg className="pin-dropdown-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    </div>
  );
}

function AllFeaturesContent() {
  const navigate = useNavigate();
  const { openChat } = useLayoutNav();
  const { pinFeature, unpinFeature, getPinLocation } = usePinnedFeatures();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<TabKey>('All');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const pinButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FEATURE_CATALOG.filter((f) => {
      if (tab !== 'All' && f.category !== tab) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        f.label.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    });
  }, [query, tab]);

  const grouped = useMemo(() => {
    const map = new Map<FeatureCategory, typeof FEATURE_CATALOG>();
    for (const cat of FEATURE_CATEGORY_ORDER) {
      map.set(cat, []);
    }

    for (const f of filtered) {
      map.get(f.category)?.push(f);
    }

    return FEATURE_CATEGORY_ORDER.filter((c) => (map.get(c)?.length ?? 0) > 0).map(
      (category) => ({
        category,
        items: map.get(category) ?? [],
      }),
    );
  }, [filtered]);

  const tabCounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const countFor = (category: TabKey) => {
      return FEATURE_CATALOG.filter((f) => {
        if (category !== 'All' && f.category !== category) {
          return false;
        }

        if (!q) {
          return true;
        }

        return (
          f.label.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
        );
      }).length;
    };

    return {
      All: countFor('All'),
      ...Object.fromEntries(
        FEATURE_CATEGORY_ORDER.map((c) => [c, countFor(c)]),
      ) as Record<FeatureCategory, number>,
    };
  }, [query]);

  const tabs: TabKey[] = ['All', ...FEATURE_CATEGORY_ORDER];

  const handleOpen = (entry: (typeof FEATURE_CATALOG)[number]) => {
    if (entry.navKind === 'chat') {
      openChat();
      return;
    }

    if (entry.href) {
      navigate(entry.href);
    }
  };

  const handlePinClick = (e: React.MouseEvent, featureId: string) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === featureId ? null : featureId);
  };

  return (
    <div className="all-features-page">
        <header className="all-features-topbar">
          <div className="all-features-topbar-row">
            <h1 className="all-features-title">All Features</h1>
            <label className="all-features-search-wrap">
              <span className="visually-hidden">Search features</span>
              <svg
                className="all-features-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="all-features-search-input"
                type="search"
                placeholder="Search features…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </label>
            {query.trim() ? (
              <span className="all-features-result-count">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
          <div className="all-features-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                className={`all-features-tab${tab === t ? ' is-active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
                <span className="all-features-tab-count">
                  {t === 'All' ? tabCounts.All : tabCounts[t as FeatureCategory]}
                </span>
              </button>
            ))}
          </div>
        </header>

        <div className="all-features-body">
          {filtered.length === 0 ? (
            <div className="all-features-empty">
              <p>No features match your search.</p>
              <button
                type="button"
                className="all-features-clear-search"
                onClick={() => setQuery('')}
              >
                Clear search
              </button>
            </div>
          ) : (
            grouped.map(({ category, items }) => (
              <section
                key={category}
                className="all-features-section"
                aria-labelledby={`all-features-cat-${category}`}
              >
                <div className="all-features-section-head">
                  <h2
                    className="all-features-section-title"
                    id={`all-features-cat-${category}`}
                  >
                    {category}
                  </h2>
                  <span className="all-features-section-line" aria-hidden />
                  <span className="all-features-section-count">{items.length}</span>
                </div>
                <ul className="all-features-grid">
                  {items.map((entry) => {
                    const location = getPinLocation(entry.id);
                    const isPinnedAnywhere = location !== null;
                    const titleMatch = matchesSearch(entry.label, query);
                    const descMatch = matchesSearch(entry.description, query);

                    return (
                      <li key={entry.id}>
                        <div
                          className={`all-features-tile${isPinnedAnywhere ? ' is-pinned' : ''}`}
                        >
                          <button
                            type="button"
                            className="all-features-tile-main"
                            onClick={() => handleOpen(entry)}
                          >
                            <span className="all-features-tile-label">
                              {titleMatch.highlight ?? entry.label}
                            </span>
                            <span className="all-features-tile-desc">
                              {descMatch.highlight ?? entry.description}
                            </span>
                          </button>
                          <div className="all-features-pin-wrap">
                            <button
                              type="button"
                              ref={(el) => {
                                if (el) {
                                  pinButtonRefs.current.set(entry.id, el);
                                }
                              }}
                              className={`all-features-pin${isPinnedAnywhere ? ' is-pinned' : ''}`}
                              onClick={(e) => handlePinClick(e, entry.id)}
                              aria-pressed={isPinnedAnywhere}
                              aria-label={
                                isPinnedAnywhere
                                  ? `Pinned to ${location}. Click to change`
                                  : 'Pin feature'
                              }
                              title={isPinnedAnywhere ? `Pinned to ${location}` : 'Pin feature'}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                aria-hidden
                              >
                                {isPinnedAnywhere ? (
                                  <path
                                    fill="currentColor"
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                  />
                                ) : (
                                  <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                  />
                                )}
                              </svg>
                            </button>
                            <PinDropdown
                              featureId={entry.id}
                              currentLocation={location}
                              onPin={(loc) => pinFeature(entry.id, loc)}
                              onUnpin={() => unpinFeature(entry.id)}
                              isOpen={openDropdownId === entry.id}
                              onClose={() => setOpenDropdownId(null)}
                              triggerRef={{
                                current: pinButtonRefs.current.get(entry.id) ?? null,
                              }}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
  );
}

export function AllFeaturesPage() {
  return (
    <AppLayout
      activeNav="allFeatures"
      navVariant="chapter"
      title="All Features | Profit Academy"
    >
      <AllFeaturesContent />
    </AppLayout>
  );
}
