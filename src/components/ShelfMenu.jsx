import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useShelves } from '../context/ShelvesContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ShelfFormModal } from './ShelfFormModal';

export function ShelfMenu({
  isOpen,
  onClose,
  title, // { imdbID, Title, Year, Type, Poster }
}) {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const { shelves, getItemShelves, setDefaultShelf, toggleCustomShelf } = useShelves();
  const [isCreatingShelf, setIsCreatingShelf] = useState(false);

  if (!isOpen || !title) return null;

  const currentShelfIds = getItemShelves(title.imdbID);

  const defaultShelves = shelves.filter((s) => s.isDefault);
  const customShelves = shelves.filter((s) => !s.isDefault);

  const activeDefaultShelf = defaultShelves.find((s) =>
    currentShelfIds.includes(s.id)
  );

  const handleSelectDefault = (shelfId) => {
    setDefaultShelf(shelfId, title);
  };

  const handleToggleCustom = (shelfId) => {
    toggleCustomShelf(shelfId, title);
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shelf-menu-heading"
      >
        <div
          className={isMobile ? 'shelf-menu-sheet' : 'modal-card'}
          style={isMobile ? {} : { maxWidth: '440px' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
              borderBottom: '2px solid var(--neon-cyan)',
              paddingBottom: 'var(--space-3)',
            }}
          >
            <div>
              <span className="section-label" style={{ marginBottom: 0 }}>ADD TO SHELF</span>
              <h3 id="shelf-menu-heading" style={{ fontSize: '0.85rem', margin: 0, color: 'var(--neon-green)' }}>
                {title.Title}
              </h3>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Section 1: Default Status Shelves (Radio-style) */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <span
              style={{
                fontFamily: 'var(--pixel-font)',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: 'var(--neon-yellow)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: 'var(--space-2)',
              }}
            >
              STATUS (PICK ONE)
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {defaultShelves.map((shelf) => {
                const isSelected = activeDefaultShelf?.id === shelf.id;

                return (
                  <button
                    key={shelf.id}
                    type="button"
                    onClick={() => handleSelectDefault(shelf.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      border: isSelected
                        ? '2px solid var(--neon-green)'
                        : '2px solid var(--neon-cyan)',
                      boxShadow: isSelected ? '3px 3px 0 var(--neon-pink)' : 'none',
                      backgroundColor: isSelected ? 'rgba(57, 255, 20, 0.15)' : '#000000',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--pixel-font)',
                      fontSize: '0.65rem',
                      color: isSelected ? 'var(--neon-green)' : 'var(--white)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem' }}>{shelf.emoji}</span>
                      <span>{shelf.name}</span>
                    </div>

                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid ' + (isSelected ? 'var(--neon-green)' : 'var(--neon-cyan)'),
                        backgroundColor: isSelected ? 'var(--neon-green)' : 'transparent',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Custom Shelves (Checkbox-style) */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <span
              style={{
                fontFamily: 'var(--pixel-font)',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: 'var(--neon-yellow)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: 'var(--space-2)',
              }}
            >
              CUSTOM SHELVES (MULTIPLE OK)
            </span>

            {customShelves.length === 0 ? (
              <p
                style={{
                  fontFamily: 'var(--body-font)',
                  fontSize: '1.2rem',
                  color: 'var(--color-text-muted)',
                  padding: '4px 0',
                }}
              >
                No custom shelves yet. Create your first one below!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customShelves.map((shelf) => {
                  const isChecked = currentShelfIds.includes(shelf.id);
                  return (
                    <button
                      key={shelf.id}
                      type="button"
                      onClick={() => handleToggleCustom(shelf.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 12px',
                        border: isChecked
                          ? '2px solid var(--neon-pink)'
                          : '2px solid var(--neon-cyan)',
                        boxShadow: isChecked ? '3px 3px 0 var(--neon-yellow)' : 'none',
                        backgroundColor: isChecked ? 'rgba(255, 32, 121, 0.15)' : '#000000',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'var(--pixel-font)',
                        fontSize: '0.65rem',
                        color: isChecked ? 'var(--neon-pink)' : 'var(--white)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>{shelf.emoji || '📁'}</span>
                        <span>{shelf.name}</span>
                      </div>

                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid ' + (isChecked ? 'var(--neon-pink)' : 'var(--neon-cyan)'),
                          backgroundColor: isChecked ? 'var(--neon-pink)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000000',
                        }}
                      >
                        {isChecked && <Check size={12} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* "+ New Shelf" Button */}
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', borderStyle: 'dashed' }}
            onClick={() => setIsCreatingShelf(true)}
          >
            <Plus size={16} />
            CREATE NEW SHELF
          </button>
        </div>
      </div>

      <ShelfFormModal
        isOpen={isCreatingShelf}
        onClose={() => setIsCreatingShelf(false)}
      />
    </>
  );
}
