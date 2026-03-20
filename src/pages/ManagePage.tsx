import { useState } from 'react';
import { AppLayout } from '../components/Layout';
import { chapterMembers, monthNames } from '../data';

export function ManagePage() {
  const [month, setMonth] = useState(2);
  const [year, setYear] = useState(2026);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((currentYear) => currentYear - 1);
      return;
    }

    setMonth((currentMonth) => currentMonth - 1);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((currentYear) => currentYear + 1);
      return;
    }

    setMonth((currentMonth) => currentMonth + 1);
  };

  // Mock data for payment and attendance based on member name length to make it deterministic
  const getMemberStatus = (name: string) => {
    const isPaid = name.length % 3 !== 0;
    const attended = name.length % 2 === 0;
    return { isPaid, attended };
  };

  return (
    <AppLayout
      activeNav="manage"
      navVariant="chapter"
      title="Manage Chapter | Profit Academy"
    >
      <section className="view-section active" id="manageView">
        <header className="header">
          <div className="header-left">
            <h1>Manage Chapter</h1>
            <div className="month-selector">
              <button className="month-nav" id="prevMonth" onClick={goToPreviousMonth} type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <span id="currentMonthLabel">{`${monthNames[month]} ${year}`}</span>
              <button className="month-nav" id="nextMonth" onClick={goToNextMonth} type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setIsInviteModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px' }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Invite Member
            </button>
          </div>
        </header>

        <div className="manage-section">
          <h2 className="section-heading">Chapter Members</h2>
          <div className="manage-member-grid" id="manageMemberGrid">
            {chapterMembers.map((member) => {
              const { isPaid, attended } = getMemberStatus(member.name);
              return (
                <div className="manage-member-card" key={member.name} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="manage-member-top">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="manage-member-photo"
                    />
                    <div>
                      <div className="manage-member-name">{member.name}</div>
                      <div className="manage-member-biz">{member.business}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: isPaid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: isPaid ? '#22c55e' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                      {isPaid ? 'Paid' : 'Unpaid'}
                    </div>
                    
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: attended ? 'rgba(59, 130, 246, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: attended ? '#3b82f6' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                      {attended ? 'Attended' : 'Missed'}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>View full profile</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isInviteModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Invite New Member</h3>
                <button 
                  onClick={() => setIsInviteModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input type="email" className="input-field" placeholder="colleague@business.com" />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Personal Message (Optional)</label>
                  <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Hey, I think you'd be a great fit for our chapter..."></textarea>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsInviteModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setIsInviteModalOpen(false)}>Send Invite</button>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Or share invite link:</span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input type="text" className="input-field" value="https://profitacademy.com/invite/ch-123" readOnly style={{ flex: 1 }} />
                    <button className="btn btn-secondary">Copy</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
