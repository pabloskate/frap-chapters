import { AppLayout } from '../components/Layout';
import { useAppState } from '../state/useAppState';

export function OnboardingPage() {
  const { onboardingComplete, setOnboardingComplete } = useAppState();

  return (
    <AppLayout
      activeNav="onboarding"
      navVariant="chapter"
      title="Course | Profit Academy"
    >
      <section className="view-section active" id="onboardingView">
        <header className="header">
          <h1>Course</h1>
        </header>

        <div className="onboarding-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2>Welcome to Profit Academy</h2>
            <p>
              Complete the interactive onboarding course to learn how to maximize
              your FRAP Chapter membership and build powerful joint venture
              partnerships.
            </p>

            <div className="onboarding-completion">
              <label className="completion-checkbox">
                <input
                  checked={onboardingComplete}
                  id="onboardingComplete"
                  onChange={(event) =>
                    setOnboardingComplete(event.currentTarget.checked)
                  }
                  type="checkbox"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">
                  I have completed the onboarding course
                </span>
              </label>
              <p className="completion-hint">
                Check this box to unlock FRAP Chapter features
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
