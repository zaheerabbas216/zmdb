import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { useShelves } from '../context/ShelvesContext';
import { TitleCard } from '../components/TitleCard';
import { EmptyState } from '../components/EmptyState';

export function Home() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const { getShelfItems, getShelfStats } = useShelves();

  const stats = getShelfStats();

  const watchingItems = getShelfItems('watching').slice(0, 8);
  const wantItems = getShelfItems('want').slice(0, 8);
  const watchedItems = getShelfItems('watched').slice(0, 8);

  const hasAnyItems =
    watchingItems.length > 0 || wantItems.length > 0 || watchedItems.length > 0;

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const query = heroSearch.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="section" style={{ paddingTop: 'var(--space-6)' }}>
      <div className="container">
        {/* Hero Section */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '780px',
            margin: '0 auto var(--space-8)',
          }}
        >
          <span className="section-label">Braden's Infinite Cinema Tour</span>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>
            TRACK YOUR ULTIMATE MOVIE & SERIES BINGE
          </h1>
          <p
            style={{
              fontFamily: 'var(--body-font)',
              fontSize: '1.45rem',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-6)',
              lineHeight: 1.4,
            }}
          >
            Level up your watchlist. Add titles to Watched, Watching, or Want to Watch,
            and create custom 8-bit tasting shelves for your marathon nights.
          </p>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleHeroSearchSubmit}
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              backgroundColor: '#000000',
              padding: '8px',
              border: '3px solid var(--neon-cyan)',
              boxShadow: '4px 4px 0 var(--neon-pink)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                paddingLeft: 'var(--space-2)',
                gap: 'var(--space-2)',
              }}
            >
              <Search size={20} color="var(--neon-cyan)" />
              <input
                type="search"
                placeholder="SEARCH BY TITLE, YEAR, OR KEYWORD..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  padding: '6px',
                  minHeight: 'auto',
                  backgroundColor: 'transparent',
                  color: 'var(--neon-yellow)',
                  fontSize: '1.4rem',
                }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ minWidth: '120px' }}>
              SEARCH
            </button>
          </form>
        </div>

        {/* Stats Strip / Trophy Case */}
        <div className="stats-strip">
          <div className="stat-card" style={{ borderColor: 'var(--neon-green)', boxShadow: '4px 4px 0 var(--neon-green)' }}>
            <div className="stat-value" style={{ color: 'var(--neon-green)' }}>
              {stats.watchedCount}
            </div>
            <div className="stat-label">FINISHED</div>
          </div>
          <div className="stat-card" style={{ borderColor: 'var(--neon-yellow)', boxShadow: '4px 4px 0 var(--neon-yellow)' }}>
            <div className="stat-value" style={{ color: 'var(--neon-yellow)' }}>
              {stats.watchingCount}
            </div>
            <div className="stat-label">IN PROGRESS</div>
          </div>
          <div className="stat-card" style={{ borderColor: 'var(--neon-pink)', boxShadow: '4px 4px 0 var(--neon-pink)' }}>
            <div className="stat-value" style={{ color: 'var(--neon-pink)' }}>
              {stats.wantCount}
            </div>
            <div className="stat-label">UP NEXT QUEUE</div>
          </div>
        </div>

        {/* Shelf Rows or Initial Empty State */}
        {!hasAnyItems ? (
          <div
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '3px solid var(--neon-cyan)',
              boxShadow: '4px 4px 0 var(--neon-pink)',
              padding: 'var(--space-8) var(--space-4)',
              textAlign: 'center',
              marginTop: 'var(--space-6)',
            }}
          >
            <EmptyState
              icon={Sparkles}
              title="YOUR SHELVES ARE WAITING FOR PLAYER 1"
              description="Start searching for titles and save them to Watched, Watching, or Want to Watch!"
              actionLabel="START SEARCHING"
              onAction={() => navigate('/search')}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
            {/* Continue Watching Row */}
            {watchingItems.length > 0 && (
              <section aria-labelledby="continue-watching-heading">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                    borderBottom: '2px solid var(--neon-yellow)',
                    paddingBottom: 'var(--space-2)',
                  }}
                >
                  <div>
                    <span className="section-label" style={{ color: 'var(--neon-yellow)' }}>IN PROGRESS</span>
                    <h2 id="continue-watching-heading" style={{ fontSize: '1rem', margin: 0, color: 'var(--neon-yellow)' }}>
                      🍿 CONTINUE WATCHING
                    </h2>
                  </div>
                  <Link
                    to="/shelves/watching"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--pixel-font)',
                      fontSize: '0.65rem',
                      color: 'var(--neon-cyan)',
                    }}
                  >
                    SEE ALL ({watchingItems.length}) <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="poster-grid">
                  {watchingItems.map((item) => (
                    <TitleCard key={item.imdbID} title={item.title} />
                  ))}
                </div>
              </section>
            )}

            {/* Up Next / Want to Watch Row */}
            {wantItems.length > 0 && (
              <section aria-labelledby="up-next-heading">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                    borderBottom: '2px solid var(--neon-pink)',
                    paddingBottom: 'var(--space-2)',
                  }}
                >
                  <div>
                    <span className="section-label" style={{ color: 'var(--neon-pink)' }}>NEXT UP</span>
                    <h2 id="up-next-heading" style={{ fontSize: '1rem', margin: 0, color: 'var(--neon-pink)' }}>
                      📌 WANT TO WATCH
                    </h2>
                  </div>
                  <Link
                    to="/shelves/want"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--pixel-font)',
                      fontSize: '0.65rem',
                      color: 'var(--neon-cyan)',
                    }}
                  >
                    SEE ALL ({wantItems.length}) <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="poster-grid">
                  {wantItems.map((item) => (
                    <TitleCard key={item.imdbID} title={item.title} />
                  ))}
                </div>
              </section>
            )}

            {/* Recently Watched Row */}
            {watchedItems.length > 0 && (
              <section aria-labelledby="recently-watched-heading">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                    borderBottom: '2px solid var(--neon-green)',
                    paddingBottom: 'var(--space-2)',
                  }}
                >
                  <div>
                    <span className="section-label" style={{ color: 'var(--neon-green)' }}>COMPLETED</span>
                    <h2 id="recently-watched-heading" style={{ fontSize: '1rem', margin: 0, color: 'var(--neon-green)' }}>
                      ✅ RECENTLY WATCHED
                    </h2>
                  </div>
                  <Link
                    to="/shelves/watched"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--pixel-font)',
                      fontSize: '0.65rem',
                      color: 'var(--neon-cyan)',
                    }}
                  >
                    SEE ALL ({watchedItems.length}) <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="poster-grid">
                  {watchedItems.map((item) => (
                    <TitleCard key={item.imdbID} title={item.title} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
