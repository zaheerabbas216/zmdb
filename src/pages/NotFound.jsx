import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="section" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '5rem',
            fontWeight: 900,
            color: 'var(--color-primary)',
            lineHeight: 1,
            marginBottom: 'var(--space-2)',
          }}
        >
          404
        </div>
        <span className="section-label">Off Menu</span>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-3)' }}>
          Scene Not Found
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-6)',
            fontSize: '1.05rem',
          }}
        >
          We searched through every reel and shelf, but couldn’t find the page you’re looking for.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
          <Link to="/" className="btn-primary">
            <Home size={18} />
            Back to Home
          </Link>
          <Link to="/search" className="btn-secondary">
            <Search size={18} />
            Search Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
