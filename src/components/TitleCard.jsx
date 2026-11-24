import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { PosterImage } from './PosterImage';
import { ShelfMenu } from './ShelfMenu';
import { useShelves } from '../context/ShelvesContext';

export function TitleCard({ title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getItemShelves, shelves } = useShelves();

  const assignedShelfIds = getItemShelves(title.imdbID);
  const assignedShelves = shelves.filter((s) => assignedShelfIds.includes(s.id));

  // Determine primary shelf status indicator
  const statusShelf = assignedShelves.find((s) => s.isDefault);
  const customCount = assignedShelves.filter((s) => !s.isDefault).length;

  const typeLabel = title.Type ? title.Type.toUpperCase() : 'TITLE';

  return (
    <>
      <div className="title-card">
        {/* Status indicator badge in top-left */}
        {statusShelf && (
          <div className="card-shelf-badge">
            <span
              className={`badge ${
                statusShelf.id === 'watched'
                  ? 'badge-green'
                  : statusShelf.id === 'watching'
                  ? 'badge-gold'
                  : 'badge-wine'
              }`}
              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
            >
              {statusShelf.emoji} {statusShelf.name}
            </span>
          </div>
        )}

        {/* Type badge in top-right */}
        <div className="card-type-badge">
          <span
            className={`badge ${
              title.Type === 'series' ? 'badge-series' : 'badge-movie'
            }`}
          >
            {typeLabel}
          </span>
        </div>

        <Link
          to={`/title/${title.imdbID}`}
          className="poster-wrapper"
          aria-label={`View details for ${title.Title}`}
        >
          <PosterImage src={title.Poster} title={title.Title} />
        </Link>

        <div className="title-card-body">
          <Link
            to={`/title/${title.imdbID}`}
            className="title-card-title"
            title={title.Title}
          >
            {title.Title}
          </Link>

          <div className="title-card-meta">
            <span>{title.Year}</span>
            {customCount > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  marginLeft: 'auto',
                }}
              >
                +{customCount} {customCount === 1 ? 'shelf' : 'shelves'}
              </span>
            )}
          </div>

          <div className="title-card-actions">
            <button
              type="button"
              className={`btn-sm title-card-btn ${
                assignedShelves.length > 0 ? 'btn-secondary' : 'btn-primary'
              }`}
              onClick={() => setIsMenuOpen(true)}
              aria-label={`Manage shelf for ${title.Title}`}
            >
              {assignedShelves.length > 0 ? (
                <>
                  <BookmarkCheck size={15} color="var(--color-primary)" />
                  <span>On {assignedShelves.length} {assignedShelves.length === 1 ? 'Shelf' : 'Shelves'}</span>
                </>
              ) : (
                <>
                  <Bookmark size={15} />
                  <span>Add to Shelf</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ShelfMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={title}
      />
    </>
  );
}
