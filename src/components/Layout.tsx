import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavVariant, SidebarKey } from '../types';
import { useAppState } from '../state/AppState';
import { ChatPanel } from './ChatPanel';

interface LayoutProps {
  activeNav: SidebarKey;
  navVariant: NavVariant;
  title: string;
  children: ReactNode;
}

interface NavItem {
  key: SidebarKey;
  label: string;
  to: string;
}

const chapterNavItems: NavItem[] = [
  { key: 'dashboard', label: 'Chapter Roster', to: '/dashboard' },
  { key: 'chat', label: 'Chapter Chat', to: '' },
  { key: 'board', label: 'Swap Board', to: '/board' },
  { key: 'nationwideWins', label: 'Nationwide Wins', to: '/nationwide-wins' },
  { key: 'manage', label: 'Manage Chapter', to: '/manage' },
];

const chapterNavWithInsights: NavItem[] = [
  { key: 'dashboard', label: 'Chapter Roster', to: '/dashboard' },
  { key: 'chat', label: 'Chapter Chat', to: '' },
  { key: 'board', label: 'Swap Board', to: '/board' },
  { key: 'nationwideWins', label: 'Nationwide Wins', to: '/nationwide-wins' },
  { key: 'insights', label: 'Avatar Intelligence', to: '/insights' },
  { key: 'manage', label: 'Manage Chapter', to: '/manage' },
];

const generatorNavItems: NavItem[] = [
  { key: 'dashboard', label: 'Chapter Roster', to: '/dashboard' },
  { key: 'chat', label: 'Chapter Chat', to: '' },
  { key: 'nationwideWins', label: 'Nationwide Wins', to: '/nationwide-wins' },
  { key: 'insights', label: 'Avatar Intelligence', to: '/insights' },
  { key: 'manage', label: 'Manage Chapter', to: '/manage' },
];

function getNavItems(navVariant: NavVariant) {
  switch (navVariant) {
    case 'withInsights':
      return chapterNavWithInsights;
    case 'generator':
      return generatorNavItems;
    default:
      return chapterNavItems;
  }
}

export function AppLayout({
  activeNav,
  children,
  navVariant,
  title,
}: LayoutProps) {
  const { onboardingComplete } = useAppState();
  const [isExpanded, setIsExpanded] = useState(onboardingComplete);
  const [onboardingNavExpanded, setOnboardingNavExpanded] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const navItems = getNavItems(navVariant);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    setIsExpanded(onboardingComplete);
  }, [onboardingComplete]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/onboarding')) {
      setOnboardingNavExpanded(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  return (
    <div className="app-container">
      <header className="mobile-nav-bar">
        <button
          aria-controls="app-sidebar"
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          className="mobile-nav-toggle"
          onClick={() => setMobileNavOpen((open) => !open)}
          type="button"
        >
          {mobileNavOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
        <span className="mobile-nav-brand">Profit Academy</span>
      </header>

      <div
        aria-hidden={!mobileNavOpen}
        className={`sidebar-backdrop${mobileNavOpen ? ' is-visible' : ''}`}
        onClick={() => setMobileNavOpen(false)}
        role="presentation"
      />

      <aside
        className={`sidebar${mobileNavOpen ? ' sidebar--open' : ''}`}
        id="app-sidebar"
      >
        <h2 className="sidebar-title">Profit Academy</h2>
        <nav className="sidebar-menu">
          <Link
            className={`sidebar-item ${activeNav === 'home' ? 'active' : ''}`}
            to="/"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </Link>
          <div className="sidebar-group" id="onboardingGroupContainer">
            <button
              className={`sidebar-group-header ${
                onboardingNavExpanded ? 'expanded' : ''
              }`}
              id="onboardingGroupToggle"
              onClick={() => setOnboardingNavExpanded((open) => !open)}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span>Onboarding</span>
              <svg
                className="group-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={`sidebar-subitems ${
                onboardingNavExpanded ? 'expanded' : ''
              }`}
              id="onboardingGroup"
            >
              <Link
                className={`sidebar-subitem ${
                  activeNav === 'onboarding' ? 'active' : ''
                }`}
                to="/onboarding"
              >
                <span>Course</span>
              </Link>
              <Link
                className={`sidebar-subitem ${
                  activeNav === 'onboardingImplementation' ? 'active' : ''
                }`}
                to="/onboarding/implementation"
              >
                <span>Implementation</span>
              </Link>
            </div>
          </div>
          <Link
            className={`sidebar-item ${
              activeNav === 'education' ? 'active' : ''
            }`}
            to="/education"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 4h15a4 4 0 0 1 4 4v12H6a4 4 0 0 0-4 4V4z" />
              <path d="M6 20V8a4 4 0 0 1 4-4" />
            </svg>
            <span>Education</span>
          </Link>

          <div
            className={`sidebar-group ${!onboardingComplete ? 'disabled' : ''}`}
            id="frapGroupContainer"
          >
            <button
              className={`sidebar-group-header ${
                onboardingComplete && isExpanded ? 'expanded' : ''
              } ${!onboardingComplete ? 'disabled' : ''}`}
              id="frapGroupToggle"
              onClick={() => {
                if (!onboardingComplete) {
                  return;
                }

                setIsExpanded((currentValue) => !currentValue);
              }}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>FRAP Chapter</span>
              <svg
                className="group-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <svg
                className="lock-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>
            <div
              className={`sidebar-subitems ${
                onboardingComplete && isExpanded ? 'expanded' : ''
              }`}
              id="frapGroup"
            >
              {navItems.map((item) =>
                item.key === 'chat' ? (
                  <button
                    className={`sidebar-subitem${chatOpen ? ' active' : ''}`}
                    key={item.key}
                    onClick={() => setChatOpen((open) => !open)}
                    type="button"
                  >
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    className={`sidebar-subitem ${
                      activeNav === item.key ? 'active' : ''
                    }`}
                    key={item.key}
                    to={item.to}
                  >
                    <span>{item.label}</span>
                  </Link>
                ),
              )}
            </div>
          </div>
        </nav>
      </aside>

      <main className="main-content">{children}</main>

      {onboardingComplete && (
        <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
