import { chapterMembers, getInitials } from '../data';
import type { Member, SwapTypeId } from '../types';

function firstName(name: string) {
  return name.split(/\s+/).filter(Boolean)[0] ?? name;
}

function getPartner(memberPartner: string): Member | undefined {
  return chapterMembers.find((member) => member.business === memberPartner);
}

function socialHtml(partnerBusiness: string, partnerFirstName: string) {
  return `
    <div class="generated-social-post" style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px;">
      <div class="social-post-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div class="social-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: var(--accent-yellow); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--bg-primary); font-size: 16px;">B</div>
        <div class="social-post-info">
          <h4 style="font-size: 14px; font-weight: 600;">Bowerman Artistry</h4>
          <span style="font-size: 11px; color: var(--text-secondary);">Just now · Phoenix, AZ</span>
        </div>
      </div>
      <div class="social-post-content" style="font-size: 14px; line-height: 1.6; color: var(--text-primary); margin-bottom: 12px;">Real talk - I just had the team from @${partnerBusiness} over and WOW. My place has never looked this good. The best part was how ${partnerFirstName} pointed out a few maintenance issues early before they became expensive problems. That level of detail is exactly why I recommend this chapter partner.</div>
      <div class="social-post-meta" style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-light);">
        <span class="social-post-tags" style="font-size: 12px; color: var(--accent-blue);">#LocalBusiness #HomeServices #Phoenix</span>
        <span class="social-char-count" style="font-size: 11px; color: var(--text-secondary);">265 characters</span>
      </div>
    </div>
  `;
}

function facebookGroupHtml(partnerBusiness: string, partnerFirstName: string) {
  return `
    <div class="generated-social-post" style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px;">
      <div class="social-post-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div class="social-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: var(--accent-yellow); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--bg-primary); font-size: 16px;">B</div>
        <div class="social-post-info">
          <h4 style="font-size: 14px; font-weight: 600;">Phoenix Homeowners Group</h4>
          <span style="font-size: 11px; color: var(--text-secondary);">Community recommendation</span>
        </div>
      </div>
      <div class="social-post-content" style="font-size: 14px; line-height: 1.6; color: var(--text-primary); margin-bottom: 12px;">If anyone is looking for a reliable local provider, I highly recommend ${partnerBusiness}. ${partnerFirstName} and the team have been excellent to work with and consistently deliver great service.</div>
      <div class="social-post-meta" style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-light);">
        <span class="social-post-tags" style="font-size: 12px; color: var(--accent-blue);">#PhoenixHomeowners</span>
        <span class="social-char-count" style="font-size: 11px; color: var(--text-secondary);">231 characters</span>
      </div>
    </div>
  `;
}

function interviewHtml(partnerName: string, partnerFirstName: string) {
  return `
    <div class="generated-interview" style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px;">
      <div class="interview-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-light);">
        <div class="interview-participants" style="display: flex; align-items: center; gap: 10px;">
          <div class="interview-participant" style="display: flex; align-items: center; gap: 8px;">
            <div class="interview-participant-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-yellow); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; color: var(--bg-primary);">L</div>
            <span class="interview-participant-name" style="font-weight: 500; font-size: 13px;">Lindsay</span>
          </div>
          <span class="interview-vs" style="color: var(--text-secondary); font-size: 11px;">x</span>
          <div class="interview-participant" style="display: flex; align-items: center; gap: 8px;">
            <div class="interview-participant-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-blue); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; color: white;">${getInitials(partnerName)}</div>
            <span class="interview-participant-name" style="font-weight: 500; font-size: 13px;">${partnerName}</span>
          </div>
        </div>
        <div class="interview-timing" style="background: rgba(63, 185, 80, 0.15); padding: 6px 10px; border-radius: 6px; font-size: 11px; color: var(--accent-green); font-weight: 500;">Best: Late April</div>
      </div>
      <div class="interview-questions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <h4 style="font-size: 12px; font-weight: 600; margin-bottom: 10px; color: var(--accent-yellow); text-transform: uppercase; letter-spacing: 0.5px;">Questions for ${partnerFirstName}</h4>
          <div class="interview-question" style="padding: 10px 12px; background: var(--bg-card); border-radius: 6px; margin-bottom: 8px; font-size: 13px; line-height: 1.4;">How do you help clients choose the right service plan?</div>
          <div class="interview-question" style="padding: 10px 12px; background: var(--bg-card); border-radius: 6px; margin-bottom: 8px; font-size: 13px; line-height: 1.4;">What mistakes do homeowners make before calling a pro?</div>
          <div class="interview-question" style="padding: 10px 12px; background: var(--bg-card); border-radius: 6px; margin-bottom: 8px; font-size: 13px; line-height: 1.4;">What is your #1 preventive tip people can do this month?</div>
        </div>
        <div>
          <h4 style="font-size: 12px; font-weight: 600; margin-bottom: 10px; color: var(--accent-yellow); text-transform: uppercase; letter-spacing: 0.5px;">Questions for Lindsay</h4>
          <div class="interview-question" style="padding: 10px 12px; background: var(--bg-card); border-radius: 6px; margin-bottom: 8px; font-size: 13px; line-height: 1.4;">How do chapter partnerships support your clients long term?</div>
          <div class="interview-question" style="padding: 10px 12px; background: var(--bg-card); border-radius: 6px; margin-bottom: 8px; font-size: 13px; line-height: 1.4;">What makes a great referral relationship inside FRAP?</div>
        </div>
      </div>
    </div>
  `;
}

function newsletterHtml() {
  const spotlightMembers = chapterMembers.slice(0, 3);
  const cards = spotlightMembers
    .map(
      (member, index) => `
      <div class="partner-card" style="flex: 1; background: var(--bg-card); padding: 12px; border-radius: 8px; text-align: center;">
        <div class="partner-card-avatar" style="width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 6px; background: ${index % 2 === 0 ? 'var(--accent-blue)' : 'var(--accent-green)'}; display: flex; align-items: center; justify-content: center; font-weight: 600; color: white; font-size: 14px;">${getInitials(member.name)}</div>
        <div class="partner-card-name" style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">${member.name}</div>
        <div class="partner-card-company" style="font-size: 10px; color: var(--text-secondary);">${member.business}</div>
      </div>
    `,
    )
    .join('');

  return `
    <div class="generated-newsletter" style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden;">
      <div class="newsletter-header" style="padding: 16px 20px; background: var(--bg-card); border-bottom: 1px solid var(--border-light);">
        <h3 class="newsletter-title" style="font-size: 16px; font-weight: 600; margin-bottom: 2px;">Bowerman Artistry Newsletter</h3>
        <p class="newsletter-subtitle" style="font-size: 12px; color: var(--text-secondary);">March 2024 · Phoenix, AZ</p>
      </div>
      <div class="newsletter-body" style="padding: 20px;">
        <div class="newsletter-section" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-light);">
          <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--accent-yellow);">Spring Forward with Confidence</h4>
          <p style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">As we head into spring, here are local partner recommendations from our FRAP chapter.</p>
        </div>
        <div class="newsletter-section">
          <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--accent-yellow);">Chapter Partner Spotlight</h4>
          <div class="partners-spotlight" style="display: flex; gap: 10px; margin-top: 10px;">${cards}</div>
        </div>
      </div>
    </div>
  `;
}

function mailHtml(partnerBusiness: string) {
  return `
    <div class="generated-direct-mail" style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden;">
      <div class="mail-preview" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border-color);">
        <div class="mail-side" style="background: var(--bg-card); padding: 20px; min-height: 160px;">
          <h4 style="font-size: 11px; font-weight: 600; margin-bottom: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Front - Your Business</h4>
          <div class="mail-content-sample" style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Bowerman Artistry</strong><br>
            Premium PMU & Skincare<br>
            Phoenix's top beauty studio<br><br>
            "Confidence starts with self-care"
          </div>
        </div>
        <div class="mail-side" style="background: var(--bg-card); padding: 20px; min-height: 160px;">
          <h4 style="font-size: 11px; font-weight: 600; margin-bottom: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Back - Partner</h4>
          <div class="mail-content-sample" style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">${partnerBusiness}</strong><br>
            Trusted local provider<br><br>
            Special offer inside!<br>
            $50 off first service
          </div>
        </div>
      </div>
    </div>
  `;
}

interface GeneratedContentProps {
  copyDone: boolean;
  onCopyEmailSubject: () => void;
  partner: string;
  type: SwapTypeId;
}

export function GeneratedContent({
  copyDone,
  onCopyEmailSubject,
  partner,
  type,
}: GeneratedContentProps) {
  const selectedPartner = getPartner(partner);
  const partnerBusiness = selectedPartner?.business ?? partner;
  const partnerName = selectedPartner?.name ?? 'Chapter Partner';
  const partnerFirstName = firstName(partnerName);

  if (type === 'email') {
    return (
      <div
        className="generated-email"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-light)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          className="generated-email-header"
          style={{
            alignItems: 'center',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 18px',
          }}
        >
          <span
            className="generated-email-subject"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            Quick question about your home's "behind the scenes"
          </span>
          <button
            className="email-copy-btn"
            onClick={onCopyEmailSubject}
            style={{
              alignItems: 'center',
              background: 'var(--bg-card-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              fontSize: '12px',
              gap: '4px',
              padding: '6px 12px',
            }}
            type="button"
          >
            {copyDone ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ height: '12px', width: '12px' }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ height: '12px', width: '12px' }}
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            {copyDone ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div
          className="generated-email-body"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: 1.7,
            padding: '20px',
          }}
        >
          <p style={{ marginBottom: '14px' }}>Hey there!</p>
          <p style={{ marginBottom: '14px' }}>
            So I was chatting with my hubby Jordan last night about how most of
            us don&apos;t think about our plumbing until something goes wrong.
            And it hit me — I know a bunch of you have been dealing with some
            lingering home issues but might not even know who to call.
          </p>
          <p style={{ marginBottom: '14px' }}>
            That&apos;s why I wanted to introduce you to my friend{' '}
            {partnerFirstName} at {partnerBusiness}. They&apos;re someone I trust
            and recommend to my clients often.
          </p>
          <p style={{ marginBottom: '14px' }}>
            Here&apos;s the thing: their team is detail-oriented and often helps
            homeowners catch issues early before they turn into expensive
            headaches.
          </p>
          <p style={{ marginBottom: '14px' }}>
            {partnerFirstName}&apos;s team is super knowledgeable and gives honest
            advice - no pressure, no upselling.
          </p>
          <p style={{ marginBottom: '14px' }}>
            Anyway, if you&apos;ve been putting off getting someone to look at
            something, or just want a fresh set of eyes on your home&apos;s
            plumbing, check them out. And mention this email — they&apos;ll hook
            you up! 💪
          </p>
          <p>
            Talk soon,
            <br />
            Lindsay
          </p>
        </div>
      </div>
    );
  }

  const htmlByType: Partial<Record<SwapTypeId, string>> = {
    social: socialHtml(partnerBusiness, partnerFirstName),
    'facebook-group': facebookGroupHtml(partnerBusiness, partnerFirstName),
    interview: interviewHtml(partnerName, partnerFirstName),
    newsletter: newsletterHtml(),
    mail: mailHtml(partnerBusiness),
  };

  const html = htmlByType[type];

  if (!html) {
    return <p style={{ color: 'var(--text-secondary)' }}>Select a swap type to generate content</p>;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
