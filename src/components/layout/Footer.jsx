import React from 'react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-disclaimer">
          ZMDB uses the{' '}
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600, textDecoration: 'underline' }}
          >
            OMDb API
          </a>{' '}
          and is not affiliated with IMDb.
        </p>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            marginTop: 'var(--space-2)',
          }}
        >
          Crafted with care &bull; Your personal cinema trattoria
        </p>
      </div>
    </footer>
  );
}
