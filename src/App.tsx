import { Navigate, Route, Routes } from 'react-router-dom';
import { BoardPage } from './pages/BoardPage';
import { DashboardPage } from './pages/DashboardPage';
import { EducationPage } from './pages/EducationPage';
import { GeneratorPage } from './pages/GeneratorPage';
import { HomePage } from './pages/HomePage';
import { InsightsPage } from './pages/InsightsPage';
import { ManagePage } from './pages/ManagePage';
import { NationwideWinsPage } from './pages/NationwideWinsPage';
import { OnboardingImplementationPage } from './pages/OnboardingImplementationPage';
import { OnboardingPage } from './pages/OnboardingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/onboarding/implementation"
        element={<OnboardingImplementationPage />}
      />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/nationwide-wins" element={<NationwideWinsPage />} />
      <Route path="/chat" element={<Navigate to="/dashboard" replace />} />
      <Route path="/board" element={<BoardPage />} />
      <Route path="/manage" element={<ManagePage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/generator" element={<GeneratorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
