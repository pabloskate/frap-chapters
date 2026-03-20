import { AppLayout } from '../components/Layout';

export function EducationPage() {
  return (
    <AppLayout
      activeNav="education"
      navVariant="chapter"
      title="Education | Profit Academy"
    >
      <section className="view-section active" id="educationView">
        <header className="header">
          <h1>Education</h1>
        </header>

        <div className="onboarding-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4h15a4 4 0 0 1 4 4v12H6a4 4 0 0 0-4 4V4z" />
                <path d="M6 20V8a4 4 0 0 1 4-4" />
              </svg>
            </div>
            <h2>Education Resources</h2>
            <p>
              Access training guides, recorded sessions, and playbooks to help
              your chapter members improve collaboration and JV outcomes.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
