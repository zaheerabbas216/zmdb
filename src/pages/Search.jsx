import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, AlertCircle, RefreshCw, Film, ArrowDown } from 'lucide-react';
import { searchTitles } from '../services/omdb';
import { useDebounce } from '../hooks/useDebounce';
import { TitleCard } from '../components/TitleCard';
import { SkeletonGrid } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL params
  const urlQuery = searchParams.get('q') || '';
  const urlType = searchParams.get('type') || '';
  const urlYear = searchParams.get('y') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state for input so user can type smoothly before debounce
  const [inputValue, setInputValue] = useState(urlQuery);
  const [type, setType] = useState(urlType);
  const [year, setYear] = useState(urlYear);
  const [page, setPage] = useState(urlPage);

  const debouncedInput = useDebounce(inputValue, 400);

  // Results state
  const [titles, setTitles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Sync debounced input and filters to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedInput.trim()) params.set('q', debouncedInput.trim());
    if (type) params.set('type', type);
    if (year) params.set('y', year);
    if (page > 1) params.set('page', String(page));

    setSearchParams(params, { replace: true });
  }, [debouncedInput, type, year, page, setSearchParams]);

  // Execute Search whenever URL params or page change
  const fetchResults = useCallback(
    async (q, t, y, p, append = false) => {
      const trimmed = q?.trim();
      if (!trimmed || trimmed.length < 2) {
        setTitles([]);
        setTotalResults(0);
        setError(null);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const result = await searchTitles({
          query: trimmed,
          type: t,
          year: y,
          page: p,
        });

        if (result.error) {
          if (!append) {
            setTitles([]);
            setTotalResults(0);
          }
          setError(result.error);
        } else {
          setError(null);
          setTotalResults(result.totalResults);
          setTitles((prev) => (append ? [...prev, ...result.titles] : result.titles));
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to fetch titles.');
          if (!append) {
            setTitles([]);
            setTotalResults(0);
          }
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  // Trigger search on debounced query or filter change
  useEffect(() => {
    fetchResults(debouncedInput, type, year, 1, false);
  }, [debouncedInput, type, year, fetchResults]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(debouncedInput, type, year, nextPage, true);
  };

  const handleRetry = () => {
    fetchResults(debouncedInput, type, year, page, false);
  };

  const hasMore = titles.length < totalResults;
  const isIdle = !debouncedInput || debouncedInput.trim().length < 2;

  return (
    <div className="section">
      <div className="container">
        {/* Header & Title */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <span className="section-label">Find Your Next Watch</span>
          <h1>Search Cinema & Television</h1>
        </div>

        {/* Search Controls Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-panel)',
            border: '3px solid var(--neon-cyan)',
            padding: 'var(--space-5)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--space-4)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <label
                htmlFor="main-search-input"
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--pixel-font)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-2)',
                  color: 'var(--neon-cyan)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                TITLE OR KEYWORD
              </label>
              <div style={{ position: 'relative' }}>
                <SearchIcon
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                  }}
                />
                <input
                  id="main-search-input"
                  type="search"
                  placeholder="e.g. Bad Boys, The Godfather, Succession..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    paddingLeft: '40px',
                    backgroundColor: 'var(--color-bg)',
                  }}
                />
              </div>
            </div>

            {/* Filter Controls Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--space-3)',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <label
                  htmlFor="type-filter"
                  style={{
                    display: 'block',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--pixel-font)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-2)',
                    color: 'var(--neon-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  FORMAT / TYPE
                </label>
                <select
                  id="type-filter"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                  style={{ backgroundColor: '#000000', color: 'var(--neon-yellow)' }}
                >
                  <option value="">ALL FORMATS</option>
                  <option value="movie">MOVIES ONLY</option>
                  <option value="series">SERIES ONLY</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="year-filter"
                  style={{
                    display: 'block',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--pixel-font)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-2)',
                    color: 'var(--neon-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  RELEASE YEAR (OPTIONAL)
                </label>
                <input
                  id="year-filter"
                  type="number"
                  placeholder="e.g. 2024"
                  min="1880"
                  max="2030"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                  }}
                  style={{ backgroundColor: 'var(--color-bg)' }}
                />
              </div>

              {(type || year || inputValue) && (
                <div>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      setInputValue('');
                      setType('');
                      setYear('');
                      setPage(1);
                    }}
                    style={{ width: '100%' }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        {!isIdle && !isLoading && totalResults > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
            }}
          >
            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Found <strong>{totalResults}</strong> {totalResults === 1 ? 'title' : 'titles'} for "
              <strong>{debouncedInput}</strong>"
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Showing {titles.length} of {totalResults}
            </span>
          </div>
        )}

        {/* Content States */}
        {isLoading ? (
          <SkeletonGrid count={10} />
        ) : error ? (
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-10) var(--space-4)',
              textAlign: 'center',
            }}
          >
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
            <h3 style={{ marginBottom: 'var(--space-2)' }}>{error}</h3>
            <p
              style={{
                color: 'var(--color-text-muted)',
                maxWidth: '440px',
                margin: '0 auto var(--space-4)',
                fontSize: '0.95rem',
              }}
            >
              {error.includes('API key')
                ? 'Please check your OMDb API key in Settings or in your .env file.'
                : 'Try adjusting your search terms, check the spelling, or remove the year filter.'}
            </p>
            <button type="button" className="btn-secondary" onClick={handleRetry}>
              <RefreshCw size={16} />
              Retry Search
            </button>
          </div>
        ) : isIdle ? (
          <EmptyState
            icon={Film}
            title="Search the OMDb Database"
            description="Type at least 2 characters to discover movies and series to add to your custom shelves."
          />
        ) : titles.length === 0 ? (
          <EmptyState
            icon={Film}
            title={`No titles found for "${debouncedInput}"`}
            description="We couldn't find any movies or series matching your search criteria. Try a different title or clearing the year filter."
          />
        ) : (
          <>
            <div className="poster-grid">
              {titles.map((title) => (
                <TitleCard key={title.imdbID} title={title} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 'var(--space-8)',
                }}
              >
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  style={{ minWidth: '180px' }}
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      Loading More...
                    </>
                  ) : (
                    <>
                      <ArrowDown size={16} />
                      Load More Results ({titles.length} of {totalResults})
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
