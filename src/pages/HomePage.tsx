import { Link } from 'react-router-dom';
import { AppLayout } from '../components/Layout';
import { useAppState } from '../state/AppState';

export function HomePage() {
  const { onboardingComplete } = useAppState();

  return (
    <AppLayout
      activeNav="home"
      navVariant="chapter"
      title="Home | Profit Academy"
    >
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
    </AppLayout>
  );
}
