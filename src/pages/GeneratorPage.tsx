import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GeneratedContent } from '../components/GeneratedContent';
import { AppLayout } from '../components/Layout';
import {
  defaultPartnerBusiness,
  generatorTypeNames,
  swapMenuSections,
  swapTypes,
} from '../data';
import { useLockedBody } from '../hooks/useLockedBody';
import type { SwapTypeId } from '../types';

const tunableTypes: SwapTypeId[] = ['email', 'social', 'facebook-group'];

function isSwapType(value: string | null): value is SwapTypeId {
  return swapTypes.some((swapType) => swapType.id === value);
}

export function GeneratorPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawType = searchParams.get('type');
  const currentType = isSwapType(rawType) ? rawType : 'email';
  const currentPartner = searchParams.get('partner') || defaultPartnerBusiness;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/dashboard');
  };

  const selectSwapType = (type: SwapTypeId) => {
    setSearchParams({
      partner: currentPartner,
      type,
    });
  };

  return (
    <GeneratorPageContent
      key={`${currentType}:${currentPartner}`}
      currentPartner={currentPartner}
      currentType={currentType}
      onBack={handleBack}
      onSelectSwapType={selectSwapType}
    />
  );
}

interface GeneratorPageContentProps {
  currentPartner: string;
  currentType: SwapTypeId;
  onBack: () => void;
  onSelectSwapType: (type: SwapTypeId) => void;
}

function GeneratorPageContent({
  currentPartner,
  currentType,
  onBack,
  onSelectSwapType,
}: GeneratorPageContentProps) {
  const generatorContentRef = useRef<HTMLDivElement>(null);
  const [activeTone, setActiveTone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyAllDone, setCopyAllDone] = useState(false);
  const [copyEmailSubjectDone, setCopyEmailSubjectDone] = useState(false);
  const [isSwapTypeModalOpen, setIsSwapTypeModalOpen] = useState(false);

  useLockedBody(isSwapTypeModalOpen);

  useEffect(() => {
    if (!isSwapTypeModalOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSwapTypeModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSwapTypeModalOpen]);

  const handleCopyEmailSubject = async () => {
    try {
      await navigator.clipboard.writeText(
        `Quick question about your home's "behind the scenes"`,
      );
      setCopyEmailSubjectDone(true);
      window.setTimeout(() => {
        setCopyEmailSubjectDone(false);
      }, 1500);
    } catch {
      // Ignore clipboard failures in prototype mode.
    }
  };

  const handleCopyAll = async () => {
    let content = '';

    if (currentType === 'thankyou') {
      content = `Thank You Page Swap Content

Headline: While You Wait...
Offer: Get $50 off your first home cleaning. Mention this page. Valid through April 30th.
Partner: ${currentPartner}

Banner: 800×200px split design with both brand logos

Implementation:
1. Add this content to your thank you page after form submission
2. Create banner image with both brand logos
3. Link CTA button to partner's booking/contact page
4. Set offer expiration date`;
    } else {
      content = generatorContentRef.current?.innerText || '';
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopyAllDone(true);
      window.setTimeout(() => {
        setCopyAllDone(false);
      }, 2000);
    } catch {
      // Ignore clipboard failures in prototype mode.
    }
  };

  const handleNewVersion = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const showThankYouView = currentType === 'thankyou';
  const showFineTuneControls = tunableTypes.includes(currentType);

  return (
    <AppLayout
      activeNav="dashboard"
      navVariant="generator"
      title="Swap Generator | Profit Academy"
    >
      <section className="view-section active">
        <div
          className="generator-header"
          style={{
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '24px',
            padding: '20px 0',
          }}
        >
          <div className="generator-title-row">
            <h1 id="generatorTitle">{generatorTypeNames[currentType]}</h1>
            <span className="generator-partner">
              for <strong id="generatorTo">{currentPartner}</strong>
            </span>
          </div>
          <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
            <button
              className="change-partner-btn"
              id="changePartnerBtn"
              onClick={onBack}
              type="button"
            >
              ← Back
            </button>
            <button
              className="change-partner-btn"
              id="swapTypeBtn"
              onClick={() => setIsSwapTypeModalOpen(true)}
              type="button"
            >
              Change Swap Type
            </button>
          </div>
        </div>

        <div id="thankyouView" style={{ display: showThankYouView ? 'block' : 'none' }}>
          <div
            className="thankyou-match-bar"
            style={{
              alignItems: 'center',
              background: 'rgba(63, 185, 80, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              padding: '12px 16px',
            }}
          >
            <span
              className="match-indicator high"
              style={{
                background: 'var(--accent-green)',
                borderRadius: '12px',
                color: 'var(--bg-primary)',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 10px',
              }}
            >
              94% Match
            </span>
            <span
              className="match-reason"
              style={{ color: 'var(--text-secondary)', fontSize: '12px' }}
            >
              Strong avatar overlap — homeowners seeking services
            </span>
          </div>
          <div
            className="thankyou-preview"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              marginBottom: '20px',
              overflow: 'hidden',
            }}
          >
            <div
              className="thankyou-browser-bar"
              style={{
                alignItems: 'center',
                background: 'var(--bg-card-hover)',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                gap: '6px',
                padding: '8px 16px',
              }}
            >
              <span
                className="browser-dot"
                style={{
                  background: '#ff5f56',
                  borderRadius: '50%',
                  height: '8px',
                  width: '8px',
                }}
              ></span>
              <span
                className="browser-dot"
                style={{
                  background: '#ffbd2e',
                  borderRadius: '50%',
                  height: '8px',
                  width: '8px',
                }}
              ></span>
              <span
                className="browser-dot"
                style={{
                  background: '#27ca40',
                  borderRadius: '50%',
                  height: '8px',
                  width: '8px',
                }}
              ></span>
              <span
                className="browser-url"
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  marginLeft: '8px',
                  padding: '3px 10px',
                }}
              >
                yoursite.com/thank-you
              </span>
            </div>
            <div
              className="thankyou-content"
              style={{
                background: 'linear-gradient(135deg, #1a1f26 0%, #0d1117 100%)',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div className="thankyou-hero">
                <h1
                  style={{
                    color: 'var(--accent-green)',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '28px',
                    fontWeight: 800,
                    marginBottom: '4px',
                  }}
                >
                  Thank You!
                </h1>
                <p
                  className="thankyou-subtitle"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    marginBottom: '20px',
                  }}
                >
                  Your request has been received
                </p>
              </div>
              <div
                className="thankyou-offer"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  margin: '0 auto',
                  maxWidth: '320px',
                  padding: '20px',
                }}
              >
                <div
                  className="offer-badge"
                  style={{
                    background: 'var(--accent-yellow)',
                    borderRadius: '10px',
                    color: 'var(--bg-primary)',
                    display: 'inline-block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    marginBottom: '10px',
                    padding: '3px 8px',
                    textTransform: 'uppercase',
                  }}
                >
                  Special Offer
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                  While You Wait...
                </h2>
                <p
                  className="offer-desc"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    marginBottom: '12px',
                  }}
                >
                  Get <strong style={{ color: 'var(--accent-green)', fontSize: '16px' }}>$50 off</strong>{' '}
                  your first home cleaning. Mention this page. Valid through April 30th.
                </p>
                <div
                  className="partner-cta-row"
                  style={{
                    display: 'flex',
                    fontSize: '11px',
                    gap: '6px',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    className="partner-cta-label"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Partner:
                  </span>
                  <span
                    className="partner-cta-name"
                    id="thankyouPartnerName"
                    style={{ color: 'var(--accent-blue)', fontWeight: 500 }}
                  >
                    {currentPartner}
                  </span>
                </div>
                <button
                  className="offer-cta"
                  style={{
                    background: 'var(--accent-green)',
                    border: 'none',
                    borderRadius: '20px',
                    color: 'var(--bg-primary)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '10px 24px',
                    transition: 'all 0.2s ease',
                  }}
                  type="button"
                >
                  Claim My $50 Off
                </button>
              </div>
            </div>
          </div>
          <div
            className="thankyou-specs-compact"
            style={{
              background: 'var(--bg-card)',
              borderRadius: '8px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px',
              padding: '16px',
            }}
          >
            <div className="spec-compact" style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
              <span className="spec-compact-label" style={{ color: 'var(--text-secondary)' }}>
                Headline:
              </span>
              <span className="spec-compact-value" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                &quot;While You Wait...&quot;
              </span>
            </div>
            <div className="spec-compact" style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
              <span className="spec-compact-label" style={{ color: 'var(--text-secondary)' }}>
                Offer:
              </span>
              <span className="spec-compact-value" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                $50 off, expires April 30
              </span>
            </div>
            <div className="spec-compact" style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
              <span className="spec-compact-label" style={{ color: 'var(--text-secondary)' }}>
                Banner:
              </span>
              <span className="spec-compact-value" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                800×200px split design
              </span>
            </div>
          </div>
        </div>

        <div
          id="generatorContent"
          ref={generatorContentRef}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            display: showThankYouView ? 'none' : 'block',
            marginBottom: '20px',
            padding: '24px',
          }}
        >
          <GeneratedContent
            copyDone={copyEmailSubjectDone}
            onCopyEmailSubject={handleCopyEmailSubject}
            partner={currentPartner}
            type={currentType}
          />
        </div>

        <div
          className="generator-footer"
          style={{
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'space-between',
            padding: '16px 0',
          }}
        >
          <div
            className="fine-tune-controls"
            id="fineTuneControls"
            style={{
              alignItems: 'center',
              display: showFineTuneControls ? 'flex' : 'none',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                marginRight: '8px',
              }}
            >
              Fine-tune:
            </span>
            {[
              { label: 'Funnier', tone: 'funny' },
              { label: 'More Professional', tone: 'professional' },
              { label: 'More Clever', tone: 'clever' },
            ].map((option) => (
              <button
                className="fine-tune-btn"
                data-tone={option.tone}
                key={option.tone}
                onClick={() => setActiveTone(option.tone)}
                style={{
                  background:
                    activeTone === option.tone
                      ? 'var(--accent-yellow)'
                      : 'var(--bg-card)',
                  border:
                    activeTone === option.tone
                      ? '1px solid var(--accent-yellow)'
                      : '1px solid var(--border-color)',
                  borderRadius: '16px',
                  color:
                    activeTone === option.tone
                      ? 'var(--bg-primary)'
                      : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '6px 12px',
                  transition: 'all 0.2s ease',
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="generator-buttons" style={{ display: 'flex', gap: '10px' }}>
            <button
              className="regenerate-btn"
              id="regenerateBtn"
              onClick={showThankYouView ? undefined : handleNewVersion}
              style={{
                alignItems: 'center',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                fontSize: '13px',
                fontWeight: 500,
                gap: '6px',
                padding: '10px 16px',
                transition: 'all 0.2s ease',
              }}
              type="button"
            >
              {isGenerating ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ height: '14px', width: '14px' }}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ height: '14px', width: '14px' }}
                  >
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  New Version
                </>
              )}
            </button>
            <button
              className="copy-all-btn"
              id="copyAllBtn"
              onClick={handleCopyAll}
              style={{
                alignItems: 'center',
                background: 'var(--accent-yellow)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--bg-primary)',
                cursor: 'pointer',
                display: 'flex',
                fontSize: '13px',
                fontWeight: 500,
                gap: '6px',
                padding: '10px 16px',
                transition: 'all 0.2s ease',
              }}
              type="button"
            >
              {copyAllDone ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ height: '14px', width: '14px' }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ height: '14px', width: '14px' }}
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <div
        className="modal-overlay"
        id="swapTypeModal"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsSwapTypeModalOpen(false);
          }
        }}
        style={{
          alignItems: 'center',
          backdropFilter: 'blur(8px)',
          background: 'rgba(0, 0, 0, 0.8)',
          display: isSwapTypeModalOpen ? 'flex' : 'none',
          justifyContent: 'center',
          left: 0,
          padding: '20px',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <div
          className="modal swap-menu-modal"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            maxHeight: '90vh',
            maxWidth: '1100px',
            overflowY: 'auto',
            position: 'relative',
            width: '100%',
          }}
        >
          <button
            className="modal-close"
            id="swapTypeClose"
            onClick={() => setIsSwapTypeModalOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '24px',
              position: 'absolute',
              right: '20px',
              top: '20px',
            }}
            type="button"
          >
            &times;
          </button>
          <div
            className="modal-header"
            style={{
              borderBottom: '1px solid var(--border-light)',
              padding: '24px 24px 16px',
            }}
          >
            <h2
              className="modal-title"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              Select Swap Type
            </h2>
            <p
              className="modal-subtitle"
              style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
            >
              Choose the type of joint venture swap you want to create
            </p>
          </div>
          {swapMenuSections.map((section, index) => (
            <div
              className="swap-menu-section"
              key={section.title}
              style={{ padding: '0 24px 20px' }}
            >
              <h4
                className="swap-section-title"
                style={{
                  borderTop: index === 0 ? 'none' : '1px solid var(--border-light)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  marginBottom: '12px',
                  paddingTop: '20px',
                  textTransform: 'uppercase',
                }}
              >
                {section.title}
              </h4>
              <div
                className="swap-menu-row"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}
              >
                {section.items.map((item) => (
                  <button
                    className="swap-type-selector"
                    data-swap-type={item.type}
                    key={item.type}
                    onClick={() => {
                      onSelectSwapType(item.type);
                      setIsSwapTypeModalOpen(false);
                    }}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      flex: 1,
                      minWidth: '200px',
                      padding: '16px',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    type="button"
                  >
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {item.description}
                    </div>
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
