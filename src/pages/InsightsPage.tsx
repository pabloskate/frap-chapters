import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/Layout';
import { chapterMemberCount, insightCards } from '../data';

export function InsightsPage() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <AppLayout
      activeNav="insights"
      navVariant="withInsights"
      title="Avatar Intelligence | Profit Academy"
    >
      <section className="view-section active" id="insightsView">
        <header className="header">
          <h1>Avatar Intelligence Engine</h1>
          <button className="edit-btn" type="button">
            Edit My Avatar
          </button>
        </header>
        <div className="avatar-engine-overview">
          <div className="engine-stats">
            <div className="stat-card">
              <span className="stat-value">{chapterMemberCount}</span>
              <span className="stat-label">Chapter Members</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">23</span>
              <span className="stat-label">Swap Recommendations</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">94%</span>
              <span className="stat-label">Your Avatar Match</span>
            </div>
          </div>
        </div>
        <section className="swap-board">
          <div className="swap-header">
            <div className="swap-title">
              <h2>Chapter Member Insights</h2>
              <svg
                className="refresh-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                onClick={handleRefresh}
                style={{
                  transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </div>
          </div>
          <p className="swap-subtitle">
            AI-powered compatibility analysis based on avatar overlap
          </p>
          <div className="avatar-insights-grid">
            {insightCards.map((insight) => (
              <div className="insight-card" key={insight.name}>
                <div className="insight-card-header">
                  <img
                    src={insight.photo}
                    alt={insight.name}
                    className="insight-avatar"
                  />
                  <div className="insight-info">
                    <h4>{insight.name}</h4>
                    <span>{insight.business}</span>
                  </div>
                  <div className="insight-score">
                    <div
                      className={`insight-score-value ${insight.medium ? 'medium' : ''}`}
                    >
                      {insight.score}
                    </div>
                    <div className="insight-score-label">{insight.scoreLabel}</div>
                  </div>
                </div>
                <div className="insight-factors">
                  {insight.factors.map((factor) => (
                    <span
                      className={`insight-factor ${
                        factor.warning ? 'warning' : factor.match ? 'match' : ''
                      }`}
                      key={factor.label}
                    >
                      {factor.label}
                    </span>
                  ))}
                </div>
                <div className="insight-actions">
                  {insight.actions.map((action) => (
                    <button
                      className={`insight-action-btn ${action.primary ? 'primary' : ''}`}
                      key={action.label}
                      onClick={() =>
                        navigate(
                          `/generator?type=${action.type}&partner=${encodeURIComponent(
                            insight.business,
                          )}`,
                        )
                      }
                      type="button"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AppLayout>
  );
}
