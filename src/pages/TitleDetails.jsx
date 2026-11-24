import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Bookmark,
  BookmarkCheck,
  Tv,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { getTitleDetails } from '../services/omdb';
import { useShelves } from '../context/ShelvesContext';
import { PosterImage } from '../components/PosterImage';
import { ShelfMenu } from '../components/ShelfMenu';
import { Skeleton } from '../components/Skeleton';

export function TitleDetails() {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const { getItemShelves, shelves } = useShelves();

  const [titleData, setTitleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTitleDetails(imdbID, { signal: controller.signal });
        if (isMounted) {
          setTitleData(data);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch title details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (imdbID) {
      fetchDetails();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [imdbID]);

  const assignedShelfIds = titleData ? getItemShelves(titleData.imdbID) : [];
  const assignedShelves = shelves.filter((s) => assignedShelfIds.includes(s.id));

  // Extract Rotten Tomatoes rating if available
  const rottenTomatoesRating = titleData?.Ratings?.find(
    (r) => r.Source === 'Rotten Tomatoes'
  )?.Value;

  // Helper to check if a field is valid (not "N/A" or empty)
  const isValidField = (val) => val && val !== 'N/A' && val.trim() !== '';

  if (isLoading) {
    return (
      <div className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Skeleton height="32px" width="160px" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-8)',
              }}
            >
              <Skeleton height="450px" style={{ borderRadius: 'var(--radius-lg)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Skeleton height="40px" width="70%" />
                <Skeleton height="24px" width="40%" />
                <Skeleton height="100px" width="100%" />
                <Skeleton height="30px" width="50%" />
                <Skeleton height="30px" width="60%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !titleData) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(179, 38, 30, 0.1)',
              color: 'var(--color-danger)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
            }}
          >
            <AlertCircle size={32} />
          </div>
          <h2>Unable to Load Title</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            {error || 'No details could be retrieved for this title.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const genreChips = isValidField(titleData.Genre)
    ? titleData.Genre.split(',').map((g) => g.trim())
    : [];

  return (
    <div className="section">
      <div className="container">
        {/* Back Link */}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: 'var(--space-4)',
            fontSize: '0.9rem',
            fontWeight: 600,
            paddingLeft: 0,
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Two-Column Title Details Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-panel)',
            border: '3px solid var(--neon-cyan)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr',
          }}
          className="title-details-layout"
        >
          <style>{`
            @media (min-width: 860px) {
              .title-details-layout {
                grid-template-columns: 360px 1fr !important;
              }
            }
          `}</style>

          {/* Left Column: Poster & Quick Shelf CTA */}
          <div
            style={{
              backgroundColor: '#000000',
              borderRight: '3px solid var(--neon-cyan)',
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--space-6)',
              gap: 'var(--space-4)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '300px',
                aspectRatio: '2 / 3',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-retro-pink)',
                backgroundColor: 'var(--bg-panel)',
                border: '2px solid var(--neon-cyan)',
              }}
            >
              <PosterImage
                src={titleData.Poster}
                title={titleData.Title}
                className="poster-img"
              />
            </div>

            {/* Shelf Management Action Button */}
            <button
              type="button"
              className={assignedShelves.length > 0 ? 'btn-secondary' : 'btn-primary'}
              onClick={() => setIsMenuOpen(true)}
              style={{ width: '100%', maxWidth: '300px', minHeight: '44px' }}
            >
              {assignedShelves.length > 0 ? (
                <>
                  <BookmarkCheck size={18} color="var(--neon-green)" />
                  <span>ON {assignedShelves.length} {assignedShelves.length === 1 ? 'SHELF' : 'SHELVES'}</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  <span>ADD TO SHELF</span>
                </>
              )}
            </button>

            {/* Active Shelves List */}
            {assignedShelves.length > 0 && (
              <div
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                {assignedShelves.map((s) => (
                  <Link
                    key={s.id}
                    to={`/shelves/${s.id}`}
                    className="badge badge-wine"
                    style={{ textDecoration: 'none' }}
                  >
                    {s.emoji} {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Full Metadata & Info */}
          <div style={{ padding: 'clamp(var(--space-5), 4vw, var(--space-8))' }}>
            {/* Header: Type badge & Year */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)',
              }}
            >
              <span
                className={`badge ${
                  titleData.Type === 'series' ? 'badge-series' : 'badge-movie'
                }`}
              >
                {titleData.Type?.toUpperCase()}
              </span>
              {isValidField(titleData.Year) && (
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                  }}
                >
                  &bull; {titleData.Year}
                </span>
              )}
              {isValidField(titleData.Rated) && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    border: '1px solid var(--color-border-dark)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {titleData.Rated}
                </span>
              )}
              {isValidField(titleData.Runtime) && (
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                  }}
                >
                  &bull; {titleData.Runtime}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ marginBottom: 'var(--space-3)' }}>{titleData.Title}</h1>

            {/* Genre Chips */}
            {genreChips.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                {genreChips.map((genre) => (
                  <span
                    key={genre}
                    style={{
                      backgroundColor: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Ratings Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              {isValidField(titleData.imdbRating) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={18} fill="var(--color-gold)" color="var(--color-gold)" />
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {titleData.imdbRating}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      /10 (IMDb)
                    </span>
                  </div>
                </div>
              )}

              {rottenTomatoesRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🍅</span>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {rottenTomatoesRating}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {' '}Rotten Tomatoes
                    </span>
                  </div>
                </div>
              )}

              {isValidField(titleData.totalSeasons) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tv size={18} color="var(--color-primary)" />
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                      {titleData.totalSeasons}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {' '}{titleData.totalSeasons === '1' ? 'Season' : 'Seasons'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Plot */}
            {isValidField(titleData.Plot) && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span className="section-label">Synopsis</span>
                <p
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.65,
                    color: 'var(--color-text)',
                  }}
                >
                  {titleData.Plot}
                </p>
              </div>
            )}

            {/* Detailed Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)',
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'var(--space-5)',
              }}
            >
              {isValidField(titleData.Director) && (
                <div>
                  <span className="section-label">Director</span>
                  <p style={{ fontWeight: 600, margin: 0 }}>{titleData.Director}</p>
                </div>
              )}

              {isValidField(titleData.Writer) && (
                <div>
                  <span className="section-label">Writer(s)</span>
                  <p style={{ fontWeight: 600, margin: 0 }}>{titleData.Writer}</p>
                </div>
              )}

              {isValidField(titleData.Actors) && (
                <div>
                  <span className="section-label">Starring</span>
                  <p style={{ fontWeight: 600, margin: 0 }}>{titleData.Actors}</p>
                </div>
              )}

              {isValidField(titleData.Language) && (
                <div>
                  <span className="section-label">Language</span>
                  <p style={{ fontWeight: 600, margin: 0 }}>{titleData.Language}</p>
                </div>
              )}

              {isValidField(titleData.Country) && (
                <div>
                  <span className="section-label">Country</span>
                  <p style={{ fontWeight: 600, margin: 0 }}>{titleData.Country}</p>
                </div>
              )}

              {isValidField(titleData.Awards) && (
                <div>
                  <span className="section-label">Awards & Honors</span>
                  <p style={{ fontWeight: 600, margin: 0 }}>{titleData.Awards}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shelf Menu */}
      <ShelfMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={titleData}
      />
    </div>
  );
}
