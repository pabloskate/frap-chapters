import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/Layout';
import { SwapTypeIcon } from '../components/SwapTypeIcon';
import {
  dashboardRosterMembers,
  defaultPartnerBusiness,
  swapMenuSections,
} from '../data';
import { useLockedBody } from '../hooks/useLockedBody';
import type { SwapTypeId } from '../types';

function SwapDirectionIcon({ reverse = false }: { reverse?: boolean }) {
  return reverse ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 16V4m0 12l4 4m-4-4l-4 4M7 8v12M7 8L3 4m4 4l4-4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12m0-12l4 4m-4-4l-4 4" />
    </svg>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [isSwapMenuOpen, setIsSwapMenuOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(defaultPartnerBusiness);

  useLockedBody(isSwapMenuOpen);

  useEffect(() => {
    if (!isSwapMenuOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSwapMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSwapMenuOpen]);

  const handleOpenSwapMenu = (partner = currentPartner) => {
    setCurrentPartner(partner);
    setIsSwapMenuOpen(true);
  };

  const handleSelectSwapType = (type: SwapTypeId) => {
    navigate(`/generator?type=${type}&partner=${encodeURIComponent(currentPartner)}`);
  };

  return (
    <AppLayout
      activeNav="dashboard"
      navVariant="chapter"
      title="Chapter Roster | Profit Academy"
    >
      <section className="view-section active" id="dashboardView">
        <header className="header">
          <h1>Josh&apos;s Frap Chapter</h1>
          <div className="header-actions">
            <button className="edit-btn" type="button">
              Edit AI Settings
            </button>
          </div>
        </header>

        <section className="roster-section">
          <div className="roster-header">
            <h2>Chapter Roster</h2>
          </div>

          <div className="roster-grid">
            {dashboardRosterMembers.map((member) => (
              <div className="member-card" key={member.name}>
                <div className="member-info">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="member-avatar"
                  />
                  <div className="member-details">
                    <h3>{member.name}</h3>
                    <p>{member.business}</p>
                  </div>
                </div>
                <button
                  className="swap-btn"
                  onClick={() => handleOpenSwapMenu(member.business)}
                  type="button"
                >
                  <SwapDirectionIcon reverse={member.reverseSwapIcon} />
                  Joint Venture Swap
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>

      <div
        className={`modal-overlay ${isSwapMenuOpen ? 'active' : ''}`}
        id="swapMenuModal"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsSwapMenuOpen(false);
          }
        }}
      >
        <div className="modal swap-menu-modal">
          <button
            className="modal-close"
            id="swapMenuClose"
            onClick={() => setIsSwapMenuOpen(false)}
            type="button"
          >
            &times;
          </button>
          <div className="modal-header">
            <h2 className="modal-title">Create JV Swap</h2>
            <p className="modal-subtitle">
              Select swap type for <strong id="swapPartnerName">{currentPartner}</strong>
            </p>
          </div>
          {swapMenuSections.map((section) => (
            <div className="swap-menu-section" key={section.title}>
              <h4 className="swap-section-title">{section.title}</h4>
              <div className="swap-menu-row">
                {section.items.map((item) => (
                  <button
                    className="swap-type-card"
                    data-swap-type={item.type}
                    key={item.type}
                    onClick={() => handleSelectSwapType(item.type)}
                    type="button"
                  >
                    <div className="swap-type-icon">
                      <SwapTypeIcon type={item.type} />
                    </div>
                    <div className="swap-type-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    {item.badge ? (
                      <span className={`swap-badge ${item.badge.tone}`}>
                        {item.badge.label}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
