import React from 'react';

export function Skeleton({ width, height, className = '', style = {} }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '100%',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="title-card skeleton-card-wrapper" aria-hidden="true">
      <div className="poster-wrapper">
        <Skeleton className="skeleton-card" />
      </div>
      <div className="title-card-body">
        <Skeleton height="18px" width="80%" style={{ marginBottom: '8px' }} />
        <Skeleton height="14px" width="45%" style={{ marginBottom: '12px' }} />
        <Skeleton height="36px" width="100%" style={{ borderRadius: '8px' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="poster-grid" aria-label="Loading content" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
