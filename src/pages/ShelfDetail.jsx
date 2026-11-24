import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Filter,
  ArrowUpDown,
  Lock,
} from 'lucide-react';
import { useShelves } from '../context/ShelvesContext';
import { TitleCard } from '../components/TitleCard';
import { ShelfFormModal } from '../components/ShelfFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export function ShelfDetail() {
  const { shelfId } = useParams();
  const navigate = useNavigate();
  const { shelves, getShelfItems, deleteShelf } = useShelves();

  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'title' | 'year'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'movie' | 'series'

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const shelf = shelves.find((s) => s.id === shelfId);

  // Get raw items in shelf
  const rawItems = useMemo(() => {
    return shelf ? getShelfItems(shelf.id) : [];
  }, [shelf, getShelfItems]);

  // Apply filter and sort
  const filteredAndSortedItems = useMemo(() => {
    let items = [...rawItems];

    // Filter by type
    if (filterType !== 'all') {
      items = items.filter((item) => item.title?.Type === filterType);
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === 'recent') {
        return (b.addedAt || 0) - (a.addedAt || 0);
      }
      if (sortBy === 'title') {
        const titleA = (a.title?.Title || '').toLowerCase();
        const titleB = (b.title?.Title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      }
      if (sortBy === 'year') {
        const yearA = parseInt(a.title?.Year || '0', 10);
        const yearB = parseInt(b.title?.Year || '0', 10);
        return yearB - yearA;
      }
      return 0;
    });

    return items;
  }, [rawItems, filterType, sortBy]);

  if (!shelf) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Shelf Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            The requested movie shelf does not exist or was deleted.
          </p>
          <Link to="/shelves" className="btn-primary">
            Back to All Shelves
          </Link>
        </div>
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    deleteShelf(shelf.id);
    setIsDeleteOpen(false);
    navigate('/shelves');
  };

  return (
    <div className="section">
      <div className="container">
        {/* Back Link */}
        <Link
          to="/shelves"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: 'var(--space-4)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Shelves
        </Link>

        {/* Shelf Header Banner */}
        <div
          style={{
            backgroundColor: 'var(--bg-panel)',
            border: '3px solid var(--neon-cyan)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span
                style={{
                  fontSize: '2rem',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#000000',
                  border: '2px solid var(--neon-cyan)',
                }}
              >
                {shelf.emoji || '📁'}
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h1 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', margin: 0, color: 'var(--neon-cyan)' }}>
                    {shelf.name}
                  </h1>
                  {shelf.isDefault && (
                    <span
                      className="badge badge-gold"
                      title="Default shelves cannot be renamed or deleted"
                    >
                      <Lock size={12} /> DEFAULT
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--body-font)',
                    color: 'var(--neon-yellow)',
                    margin: '4px 0 0',
                    fontSize: '1.25rem',
                  }}
                >
                  {rawItems.length} {rawItems.length === 1 ? 'title' : 'titles'} in this collection
                </p>
              </div>
            </div>

            {/* Shelf Actions (Custom Shelves Only) */}
            {!shelf.isDefault && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setIsRenameOpen(true)}
                  aria-label="Rename shelf"
                >
                  <Edit2 size={15} />
                  Rename
                </button>
                <button
                  type="button"
                  className="btn-danger btn-sm"
                  onClick={() => setIsDeleteOpen(true)}
                  aria-label="Delete shelf"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Sort Controls */}
        {rawItems.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)',
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--bg-panel)',
              border: '2px solid var(--neon-cyan)',
              boxShadow: 'var(--shadow-retro-cyan)',
            }}
          >
            {/* Type Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Filter size={16} color="var(--neon-cyan)" />
              <button
                type="button"
                className={`btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilterType('all')}
              >
                All ({rawItems.length})
              </button>
              <button
                type="button"
                className={`btn-sm ${filterType === 'movie' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilterType('movie')}
              >
                Movies ({rawItems.filter((i) => i.title?.Type === 'movie').length})
              </button>
              <button
                type="button"
                className={`btn-sm ${filterType === 'series' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilterType('series')}
              >
                Series ({rawItems.filter((i) => i.title?.Type === 'series').length})
              </button>
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ArrowUpDown size={16} color="var(--neon-yellow)" />
              <label
                htmlFor="shelf-sort-select"
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--pixel-font)',
                  color: 'var(--neon-yellow)',
                }}
              >
                SORT:
              </label>
              <select
                id="shelf-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  minHeight: '34px',
                  padding: '2px 8px',
                  fontSize: '1.15rem',
                  backgroundColor: '#000000',
                  color: 'var(--neon-yellow)',
                  width: 'auto',
                }}
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title (A &ndash; Z)</option>
                <option value="year">Year (Newest First)</option>
              </select>
            </div>
          </div>
        )}

        {/* Shelf Content */}
        {rawItems.length === 0 ? (
          <EmptyState
            title={`Your "${shelf.name}" shelf is empty`}
            description="Explore movies and series from the catalog and add them to this collection."
            actionLabel="Search Titles to Add"
            onAction={() => navigate('/search')}
          />
        ) : filteredAndSortedItems.length === 0 ? (
          <EmptyState
            title="No matches for current filter"
            description={`No ${filterType === 'movie' ? 'movies' : 'series'} in this shelf.`}
            actionLabel="Show All Items"
            onAction={() => setFilterType('all')}
          />
        ) : (
          <div className="poster-grid">
            {filteredAndSortedItems.map((item) => (
              <TitleCard key={item.imdbID} title={item.title} />
            ))}
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {!shelf.isDefault && (
        <ShelfFormModal
          isOpen={isRenameOpen}
          onClose={() => setIsRenameOpen(false)}
          initialShelf={shelf}
        />
      )}

      {/* Delete Confirmation Modal */}
      {!shelf.isDefault && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          title={`Delete "${shelf.name}"?`}
          message={`Are you sure you want to delete this custom shelf? Titles in this shelf will remain in your other shelves (Watched, Watching, Want to Watch, etc.).`}
          confirmLabel="Delete Shelf"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteOpen(false)}
          isDanger
        />
      )}
    </div>
  );
}
