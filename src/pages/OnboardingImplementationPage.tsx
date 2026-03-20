import { AppLayout } from '../components/Layout';

export function OnboardingImplementationPage() {
  return (
    <AppLayout
      activeNav="onboardingImplementation"
      navVariant="chapter"
      title="Implementation | Profit Academy"
    >
      <section className="view-section active" id="onboardingImplementationView">
        <header className="header">
          <h1>Implementation</h1>
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
            <h2>Put onboarding into practice</h2>
            <p>
              Use this space for rollout steps, timelines, and chapter-specific
              implementation notes as you apply what you learned in the course.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
