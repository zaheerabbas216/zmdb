import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useShelves } from '../../context/ShelvesContext';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getShelfStats, items } = useShelves();

  const stats = getShelfStats();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Sync header search bar with current search URL
  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') || '');
    }
  }, [location]);

  // Global keyboard shortcut: pressing '/' focuses the search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/search');
    }
  };

  // Recent items for marquee
  const recentItems = items.slice(0, 8);
  const marqueeText =
    recentItems.length > 0
      ? recentItems
          .map((i) => `★ ${i.title.Title} (${i.title.Year}) [${i.shelfId.toUpperCase()}]`)
          .join('   ')
      : '★ WELCOME TO ZMDB ★ TRACK WHAT YOU WATCH ★ BUILD CUSTOM SHELVES ★ SEARCH MILLIONS OF TITLES ON OMDB ★';

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <NavLink to="/" className="brand-link" aria-label="ZMDB Home">
          <span>ZMDB</span>
          <span className="brand-badge">RETRO</span>
        </NavLink>

        {/* Retro Ticker Row (Desktop) */}
        <div className="header-ticker-row">
          <div className="ticker-box" style={{ borderColor: 'var(--neon-green)' }}>
            <span className="ticker-value" style={{ color: 'var(--neon-green)' }}>
              {stats.watchedCount}
            </span>
            <span className="ticker-label">WATCHED</span>
          </div>
          <div className="ticker-box" style={{ borderColor: 'var(--neon-yellow)' }}>
            <span className="ticker-value" style={{ color: 'var(--neon-yellow)' }}>
              {stats.watchingCount}
            </span>
            <span className="ticker-label">WATCHING</span>
          </div>
          <div className="ticker-box" style={{ borderColor: 'var(--neon-pink)' }}>
            <span className="ticker-value" style={{ color: 'var(--neon-pink)' }}>
              {stats.wantCount}
            </span>
            <span className="ticker-label">UP NEXT</span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <form className="header-search" onSubmit={handleSearchSubmit}>
          <Search className="header-search-icon" size={16} />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search movies & series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search movies and series"
          />
          <span className="header-search-kbd">/</span>
        </form>

        {/* Navigation links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/shelves"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            Shelves
          </NavLink>
        </nav>
      </div>

      {/* Marquee Ticker Bar */}
      <div className="header-marquee-bar" aria-hidden="true">
        <div className="marquee-content">{marqueeText}</div>
      </div>
    </header>
  );
}
