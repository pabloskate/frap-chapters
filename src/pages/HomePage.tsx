import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/Layout';
import { useLayoutNav } from '../context/useLayoutNav';
import { getFeatureById } from '../data/featureCatalog';
import { useAppState } from '../state/useAppState';
import { usePinnedFeatures } from '../state/usePinnedFeatures';

function getFeatureIcon(featureId: string) {
  // Return appropriate icon based on feature id
  if (featureId.includes('onboarding')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  if (featureId.includes('education')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4h15a4 4 0 0 1 4 4v12H6a4 4 0 0 0-4 4V4z" />
        <path d="M6 20V8a4 4 0 0 1 4-4" />
      </svg>
    );
  }
  if (featureId === 'dashboard' || featureId.includes('roster')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (featureId === 'chat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (featureId === 'board') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  if (featureId === 'nationwide-wins') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  if (featureId === 'insights') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M12 2v10h10" />
      </svg>
    );
  }
  if (featureId === 'manage') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  if (featureId === 'generator') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    );
  }
  // Default home icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

/** Renders inside AppLayout so `useLayoutNav` is under LayoutNavProvider. */
function HomePageContent() {
  const { onboardingComplete } = useAppState();
  const { homepageIds, unpinFeature } = usePinnedFeatures();
  const { openChat } = useLayoutNav();
  const navigate = useNavigate();

  const handlePinnedItemClick = (href?: string, navKind?: 'link' | 'chat') => {
    if (navKind === 'chat') {
      openChat();
      return;
    }
    if (href) {
      navigate(href);
    }
  };

  return (
    <section className="view-section active" id="homeView">
      <header className="header">
        <h1>Home</h1>
      </header>

      <div className="home-page">
        <div className="home-intro">
          <p className="home-lead">
            Profit Academy helps FRAP Chapter members onboard smoothly, learn together,
            and run swaps and joint ventures from one place.
          </p>
        </div>

        {homepageIds.length > 0 && (
          <div className="home-pinned-section">
            <h2 className="home-pinned-title">Pinned</h2>
            <ul className="home-card-grid home-card-grid--pinned">
              {homepageIds.map((id) => {
                const feature = getFeatureById(id);
                if (!feature) return null;

                return (
                  <li key={id} className="home-pinned-item">
                    <button
                      type="button"
                      className="home-card home-card--pin"
                      onClick={() =>
                        handlePinnedItemClick(feature.href, feature.navKind)
                      }
                    >
                      <span className="home-card-icon" aria-hidden>
                        {getFeatureIcon(feature.id)}
                      </span>
                      <span className="home-card-title">{feature.label}</span>
                      <span className="home-card-desc">{feature.description}</span>
                    </button>
                    <button
                      type="button"
                      className="home-pin-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        unpinFeature(id);
                      }}
                      aria-label={`Unpin ${feature.label}`}
                      title="Unpin from homepage"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        width="14"
                        height="14"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <ul className="home-card-grid">
          <li>
            <Link className="home-card" to="/onboarding">
              <span className="home-card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              <span className="home-card-title">Onboarding</span>
              <span className="home-card-desc">
                Course and implementation—get oriented and unlock chapter tools when you are ready.
              </span>
            </Link>
          </li>
          <li>
            <Link className="home-card" to="/education">
              <span className="home-card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 4h15a4 4 0 0 1 4 4v12H6a4 4 0 0 0-4 4V4z" />
                  <path d="M6 20V8a4 4 0 0 1 4-4" />
                </svg>
              </span>
              <span className="home-card-title">Education</span>
              <span className="home-card-desc">
                Training, guides, and resources for your chapter.
              </span>
            </Link>
          </li>
          <li>
            {onboardingComplete ? (
              <Link className="home-card" to="/dashboard">
                <span className="home-card-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <span className="home-card-title">Chapter roster</span>
                <span className="home-card-desc">
                  Open the FRAP Chapter workspace and member tools.
                </span>
              </Link>
            ) : (
              <Link className="home-card home-card--muted" to="/onboarding">
                <span className="home-card-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <span className="home-card-title">FRAP Chapter</span>
                <span className="home-card-desc">
                  Finish onboarding in the sidebar to unlock roster, chat, board, and more.
                </span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <AppLayout
      activeNav="home"
      navVariant="chapter"
      title="Home | Profit Academy"
    >
      <HomePageContent />
    </AppLayout>
  );
}
