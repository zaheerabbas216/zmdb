import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { PosterImage } from './PosterImage';

export function ShelfCard({ shelf, items = [] }) {
  const previewItems = items.slice(0, 3);
  const itemCount = items.length;

  return (
    <Link
      to={`/shelves/${shelf.id}`}
      className="shelf-card"
      aria-label={`View shelf ${shelf.name} with ${itemCount} items`}
    >
      <div className="shelf-collage">
        {previewItems.length > 0 ? (
          previewItems.map((item) => (
            <div key={item.imdbID} className="collage-item">
              <PosterImage
                src={item.title?.Poster}
                title={item.title?.Title}
              />
            </div>
          ))
        ) : (
          <div className="collage-empty">
            <Film size={20} />
            <span>Empty shelf</span>
          </div>
        )}
      </div>

      <div className="shelf-card-info">
        <div className="shelf-card-title">
          <span style={{ fontSize: '1.25rem' }}>{shelf.emoji || '📁'}</span>
          <span>{shelf.name}</span>
        </div>
        <span className="shelf-card-count">
          {itemCount} {itemCount === 1 ? 'title' : 'titles'}
        </span>
      </div>
    </Link>
  );
}
