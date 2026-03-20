import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppLayout } from '../components/Layout';
import {
  nationwideChaptersData,
  nationwideWinsData,
  type NationwideChapter,
  type NationwideWin,
} from '../data/nationwideWinsData';
import './nationwideWins.css';

const PAGE_SIZE = 5;

const cityColors: Record<string, string> = {
  Austin: '#22c55e',
  Dallas: '#3b82f6',
  Houston: '#f59e0b',
  'San Antonio': '#ec4899',
};

const CITY_PALETTE = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f43f5e',
];

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getCityColor(city: string) {
  return (
    cityColors[city] ??
    CITY_PALETTE[
      Math.abs(city.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) %
        CITY_PALETTE.length
    ]
  );
}

function getCityStats(wins: NationwideWin[]) {
  const byCity: Record<string, { count: number }> = {};
  wins.forEach((win) => {
    const city = win.city.split(',')[0].trim();
    if (!byCity[city]) {
      byCity[city] = { count: 0 };
    }
    byCity[city].count += 1;
  });
  return Object.entries(byCity)
    .map(([city, data]) => ({ city, ...data }))
    .sort((a, b) => b.count - a.count);
}

function getMarkerClass(city: string) {
  const key = city.toLowerCase().replace(/\s+/g, '-');
  const known = ['austin', 'dallas', 'houston', 'san-antonio'];
  return known.includes(key) ? `marker-${key}` : null;
}

function getStatIconClass(city: string) {
  const key = city.toLowerCase().replace(/\s+/g, '-');
  const known = ['austin', 'dallas', 'houston', 'san-antonio'];
  return known.includes(key) ? key : 'new-city';
}

function getChapterStats(chapters: NationwideChapter[]) {
  const byRegion: Record<string, { chapters: number; members: number }> = {};
  chapters.forEach((chapter) => {
    const region = chapter.city ? chapter.city.split(',')[0].trim() : 'Unknown';
    if (!byRegion[region]) {
      byRegion[region] = { chapters: 0, members: 0 };
    }
    byRegion[region].chapters += 1;
    byRegion[region].members += (chapter.members || []).length;
  });
  return Object.entries(byRegion)
    .map(([region, data]) => ({ region, ...data }))
    .sort((a, b) => b.chapters - a.chapters);
}

function renderChapterPopupHtml(chapter: NationwideChapter) {
  const members = chapter.members || [];
  const visibleMembers = members.slice(0, 8);
  const remainingCount = Math.max(0, members.length - 8);
  const membersHtml = visibleMembers
    .map((m) => {
      const avatarHtml = m.avatar
        ? `<img src="${escapeHtml(m.avatar)}" alt="${escapeHtml(m.name || '')}">`
        : `<span class="material-icons chapter-avatar-fallback">person</span>`;
      return `
                <span class="chapter-member-tag">
                    ${avatarHtml}
                    ${escapeHtml(m.name || 'Unknown')}
                </span>
            `;
    })
    .join('');
  const moreHtml =
    remainingCount > 0
      ? `<span class="chapter-more-members">+${remainingCount} more</span>`
      : '';

  const facilitatorAvatarHtml = chapter.facilitatorAvatar
    ? `<img src="${escapeHtml(chapter.facilitatorAvatar)}" alt="${escapeHtml(chapter.facilitator || '')}" class="chapter-popup-avatar">`
    : `<span class="chapter-popup-avatar chapter-avatar-fallback material-icons">person</span>`;

  return `
                <div class="chapter-popup-content">
                    <div class="chapter-popup-header">
                        ${facilitatorAvatarHtml}
                        <div class="chapter-popup-info">
                            <div class="chapter-popup-name">${escapeHtml(chapter.name || 'Unnamed Chapter')}</div>
                            <div class="chapter-popup-facilitator">
                                <span class="material-icons" style="font-size: 12px; vertical-align: middle;">star</span>
                                Facilitator: ${escapeHtml(chapter.facilitator || '—')}
                            </div>
                            <div class="chapter-popup-city">
                                <span class="material-icons" style="font-size: 12px;">location_on</span>
                                ${escapeHtml(chapter.city || 'Location not set')}
                            </div>
                        </div>
                    </div>
                    <div class="chapter-popup-members">
                        <div class="chapter-members-header">
                            <span class="material-icons">groups</span>
                            Members (${members.length})
                        </div>
                        <div class="chapter-members-list">
                            ${membersHtml}
                            ${moreHtml}
                        </div>
                    </div>
                    <div class="chapter-popup-stats">
                        <div class="chapter-stat">
                            <div class="chapter-stat-value">${members.length}</div>
                            <div class="chapter-stat-label">Members</div>
                        </div>
                    </div>
                </div>
            `;
}

function WinAvatar({ avatar, name }: { avatar: string | null; name: string }) {
  const [failed, setFailed] = useState(!avatar);
  if (!avatar || failed) {
    return <span className="avatar-fallback material-icons">person</span>;
  }
  return (
    <img alt={name} src={avatar} onError={() => setFailed(true)} />
  );
}

function ContributorAvatar({
  avatar,
  name,
}: {
  avatar: string | null;
  name: string;
}) {
  const [failed, setFailed] = useState(!avatar);
  return (
    <div className="contributor-avatar-wrap">
      {avatar && !failed ? (
        <img
          alt={name}
          className="contributor-avatar"
          src={avatar}
          onError={() => setFailed(true)}
        />
      ) : null}
      {(!avatar || failed) ? (
        <span className="avatar-fallback material-icons">person</span>
      ) : null}
    </div>
  );
}

function WinCard({ win }: { win: NationwideWin }) {
  return (
    <div className="card win-card">
      <div className="win-header">
        <div className="win-author">
          <div className="author-avatar">
            <WinAvatar avatar={win.avatar} name={win.name} />
          </div>
          <div className="author-info">
            <div className="author-name">{win.name}</div>
            <div className="author-meta">
              <span className="company">{win.company}</span>
              <span className="divider-dot">&bull;</span>
              <span className="city">{win.city}</span>
            </div>
          </div>
        </div>
        <span className="win-date">{win.time}</span>
      </div>
      <div className="win-content">
        <p>{win.content}</p>
      </div>
      {win.image ? (
        <div className="win-image">
          <img alt="" src={win.image} />
        </div>
      ) : null}
    </div>
  );
}

export function NationwideWinsPage() {
  const [view, setView] = useState<'wins' | 'chapters'>('wins');
  const [filterCity, setFilterCity] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [feedPage, setFeedPage] = useState(0);

  const winsMapEl = useRef<HTMLDivElement>(null);
  const chaptersMapEl = useRef<HTMLDivElement>(null);
  const winsMapInstance = useRef<L.Map | null>(null);
  const chaptersMapInstance = useRef<L.Map | null>(null);

  const cityOptions = useMemo(
    () =>
      [...new Set(nationwideWinsData.map((w) => w.city.split(',')[0]))].sort(),
    [],
  );

  const companyOptions = useMemo(
    () => [...new Set(nationwideWinsData.map((w) => w.company))].sort(),
    [],
  );

  const filteredWins = useMemo(() => {
    return nationwideWinsData.filter((w) => {
      const cityMatch =
        filterCity === 'all' || w.city.startsWith(filterCity);
      const companyMatch =
        filterCompany === 'all' || w.company === filterCompany;
      return cityMatch && companyMatch;
    });
  }, [filterCity, filterCompany]);

  const feedEnd = (feedPage + 1) * PAGE_SIZE;
  const displayedWins = filteredWins.slice(0, feedEnd);
  const hasMore = feedEnd < filteredWins.length;

  const cityStats = useMemo(
    () => getCityStats(nationwideWinsData),
    [],
  );

  const chapterStats = useMemo(
    () => getChapterStats(nationwideChaptersData),
    [],
  );

  const totalChapters = nationwideChaptersData.length;
  const totalMembers = nationwideChaptersData.reduce(
    (sum, c) => sum + (c.members || []).length,
    0,
  );

  useEffect(() => {
    const winsEl = winsMapEl.current;
    const chaptersEl = chaptersMapEl.current;
    if (!winsEl || !chaptersEl) {
      return undefined;
    }

    if (winsMapInstance.current || chaptersMapInstance.current) {
      return undefined;
    }

    const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    const winsMap = L.map(winsEl, {
      center: [31.0, -97.5],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer(tileUrl, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(winsMap);

    nationwideWinsData.forEach((win) => {
      const city = win.city.split(',')[0].trim();
      const color = getCityColor(city);
      const markerPinContent = win.avatar
        ? `<img src="${escapeHtml(win.avatar)}" alt="${escapeHtml(win.name)}" onerror="this.nextElementSibling.style.display='flex';this.style.display='none'"><span class="avatar-fallback material-icons" style="display:none">person</span>`
        : `<span class="avatar-fallback material-icons">person</span>`;
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin" style="background-color: ${color}; box-shadow: 0 0 0 4px ${color}40;">${markerPinContent}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -25],
      });
      const marker = L.marker(win.coords, { icon: markerIcon }).addTo(winsMap);
      const popupAvatarContent = win.avatar
        ? `<img src="${escapeHtml(win.avatar)}" alt="${escapeHtml(win.name)}" onerror="this.nextElementSibling.style.display='flex';this.style.display='none'"><span class="avatar-fallback material-icons" style="display:none">person</span>`
        : `<span class="avatar-fallback material-icons">person</span>`;
      const popupContent = `
                    <div class="map-popup">
                        <div class="popup-header">
                            <div class="popup-avatar-wrap">${popupAvatarContent}</div>
                            <div class="popup-info">
                                <div class="popup-name">${escapeHtml(win.name)}</div>
                                <div class="popup-company">${escapeHtml(win.company)}</div>
                                <div class="popup-city">
                                    <span class="popup-city-dot" style="background: ${color}"></span>
                                    ${escapeHtml(win.city)}
                                </div>
                            </div>
                        </div>
                        <div class="popup-win">${escapeHtml(win.win)}</div>
                        <div class="popup-time">${escapeHtml(win.time)}</div>
                    </div>
                `;
      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: false,
        maxWidth: 280,
      });
    });
    winsMapInstance.current = winsMap;

    const chaptersMap = L.map(chaptersEl, {
      center: [31.0, -97.5],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer(tileUrl, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(chaptersMap);

    nationwideChaptersData.forEach((chapter) => {
      const coords = chapter.coords;
      if (!coords || coords.length < 2) {
        return;
      }
      const memberCount = (chapter.members || []).length;
      const markerIcon = L.divIcon({
        className: 'chapter-marker',
        html: `
                        <div class="chapter-marker-pin">
                            <span class="material-icons">groups</span>
                            <span class="chapter-member-badge">${memberCount}</span>
                        </div>
                    `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -25],
      });
      const marker = L.marker(coords, { icon: markerIcon }).addTo(chaptersMap);
      marker.bindPopup(renderChapterPopupHtml(chapter), {
        className: 'chapter-popup',
        closeButton: false,
        maxWidth: 320,
      });
    });
    chaptersMapInstance.current = chaptersMap;

    const t = window.setTimeout(() => {
      winsMap.invalidateSize();
      chaptersMap.invalidateSize();
    }, 100);

    return () => {
      window.clearTimeout(t);
      winsMapInstance.current?.remove();
      chaptersMapInstance.current?.remove();
      winsMapInstance.current = null;
      chaptersMapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      winsMapInstance.current?.invalidateSize();
      chaptersMapInstance.current?.invalidateSize();
    }, 100);
    return () => window.clearTimeout(t);
  }, [view]);

  return (
    <AppLayout
      activeNav="nationwideWins"
      navVariant="chapter"
      title="FRAP Nationwide Wins | Profit Academy"
    >
      <div className="nationwide-wins-scope" data-theme="dark">
        <div className="container">
          <header className="page-header">
            <div className="flex-between align-center">
              <div>
                <h1>FRAP Nationwide Wins</h1>
                <p className="lead text-secondary">
                  Celebrate the victories of small businesses across the network
                </p>
              </div>
            </div>
          </header>

          <div className="view-toggle mb-lg">
            <div className="toggle-buttons">
              <button
                className={`toggle-btn${view === 'wins' ? ' active' : ''}`}
                onClick={() => setView('wins')}
                type="button"
              >
                <span className="material-icons">emoji_events</span>
                <span>Wins</span>
              </button>
              <button
                className={`toggle-btn${view === 'chapters' ? ' active' : ''}`}
                onClick={() => setView('chapters')}
                type="button"
              >
                <span className="material-icons">groups</span>
                <span>Chapters</span>
              </button>
            </div>
          </div>

          <div
            id="wins-view"
            style={{ display: view === 'wins' ? 'block' : 'none' }}
          >
            <section className="section" id="map-section">
              <div className="map-container card">
                <div id="wins-map" ref={winsMapEl} />

                <div className="map-legend">
                  <div className="legend-title">Total Wins by City</div>
                  <div className="legend-items">
                    {cityStats.map(({ city, count }) => {
                      const color = getCityColor(city);
                      const markerClass = getMarkerClass(city);
                      return (
                        <div className="legend-item" key={city}>
                          {markerClass ? (
                            <span
                              className={`legend-marker ${markerClass}`}
                            />
                          ) : (
                            <span
                              className="legend-marker"
                              style={{
                                background: color,
                                boxShadow: `0 0 0 3px ${color}40`,
                              }}
                            />
                          )}
                          <span className="legend-label">{city}</span>
                          <span className="legend-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="city-stats-scroll mt-lg">
                <div className="city-stats-track">
                  {cityStats.map(({ city, count }) => {
                    const iconClass = getStatIconClass(city);
                    const color = getCityColor(city);
                    const gradientStyle =
                      iconClass === 'new-city'
                        ? {
                            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                          }
                        : undefined;
                    return (
                      <div className="stat-card" key={city}>
                        <div
                          className={
                            iconClass === 'new-city'
                              ? 'stat-icon'
                              : `stat-icon ${iconClass}`
                          }
                          style={gradientStyle}
                        >
                          <span className="material-icons">location_city</span>
                        </div>
                        <div className="stat-info">
                          <div className="stat-value">{count}</div>
                          <div className="stat-label">{city} Wins</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="section" id="feed-section">
              <div className="section-header flex-between align-center mb-lg">
                <h2>Recent Wins</h2>
                <div className="flex gap-sm">
                  <select
                    className="input-field select-field filter-select"
                    onChange={(e) => {
                      setFilterCity(e.target.value);
                      setFeedPage(0);
                    }}
                    value={filterCity}
                  >
                    <option value="all">All Cities</option>
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    className="input-field select-field filter-select"
                    onChange={(e) => {
                      setFilterCompany(e.target.value);
                      setFeedPage(0);
                    }}
                    value={filterCompany}
                  >
                    <option value="all">All Companies</option>
                    {companyOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="feed-layout">
                <div className="feed-main">
                  <div className="wins-feed">
                    {displayedWins.map((win) => (
                      <WinCard key={`${win.name}-${win.time}`} win={win} />
                    ))}
                  </div>

                  <div className="text-center mt-lg">
                    {hasMore ? (
                      <button
                        className="btn btn-secondary w-full"
                        onClick={() => setFeedPage((p) => p + 1)}
                        style={{ maxWidth: 300 }}
                        type="button"
                      >
                        Load More Wins
                        <span className="material-icons">expand_more</span>
                      </button>
                    ) : null}
                  </div>
                </div>

                <aside className="feed-sidebar">
                  <div className="summary-card">
                    <h3>Recent Wins</h3>
                    <div className="contributors-list">
                      {nationwideWinsData.slice(0, 5).map((w) => (
                        <div className="contributor-row" key={`${w.name}-${w.company}`}>
                          <ContributorAvatar avatar={w.avatar} name={w.name} />
                          <div className="contributor-info">
                            <div className="contributor-name">{w.name}</div>
                            <div className="contributor-company">{w.company}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          </div>

          <div
            id="chapters-view"
            style={{ display: view === 'chapters' ? 'block' : 'none' }}
          >
            <section className="section" id="chapters-section">
              <div className="section-header flex-between align-center mb-lg">
                <h2>FRAP Chapters</h2>
                <div className="flex gap-sm align-center">
                  <span className="text-secondary text-sm">
                    <span>{totalChapters}</span> Active Chapters
                  </span>
                  <span className="text-secondary text-sm">
                    <span>{totalMembers}</span> Members
                  </span>
                </div>
              </div>

              <div className="map-container card mb-lg">
                <div id="chapters-map" ref={chaptersMapEl} />

                <div className="map-legend chapters-legend">
                  <div className="legend-title">Chapters by Region</div>
                  <div className="legend-items">
                    {chapterStats.map(({ region, chapters }) => {
                      const color = getCityColor(region);
                      return (
                        <div className="legend-item" key={region}>
                          <span
                            className="legend-marker"
                            style={{
                              background: color,
                              boxShadow: `0 0 0 3px ${color}40`,
                            }}
                          />
                          <span className="legend-label">{region}</span>
                          <span className="legend-count">{chapters}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="city-stats-scroll">
                <div className="city-stats-track">
                  {chapterStats.map(({ region, chapters, members }) => {
                    const color = getCityColor(region);
                    return (
                      <div className="stat-card" key={region}>
                        <div
                          className="stat-icon"
                          style={{
                            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                          }}
                        >
                          <span className="material-icons">groups</span>
                        </div>
                        <div className="stat-info">
                          <div className="stat-value">{chapters}</div>
                          <div className="stat-label">{region} Chapters</div>
                          <div className="stat-trend positive">
                            <span className="material-icons">person</span>
                            <span>{members} members</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
