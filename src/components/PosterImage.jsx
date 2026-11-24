import React, { useState } from 'react';
import { Film } from 'lucide-react';

export function PosterImage({ src, alt = '', className = '', title = '' }) {
  const [hasError, setHasError] = useState(false);
  const isInvalidSrc = !src || src === 'N/A' || hasError;

  if (isInvalidSrc) {
    return (
      <div className={`poster-placeholder ${className}`} aria-label={alt || title || 'Poster placeholder'}>
        <Film size={36} aria-hidden="true" />
        <span className="poster-placeholder-text">
          {title || 'No Poster'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || title || 'Movie poster'}
      loading="lazy"
      className={`poster-img ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
