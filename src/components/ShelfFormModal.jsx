import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { useShelves } from '../context/ShelvesContext';

const EMOJI_OPTIONS = ['🎬', '🍿', '🍕', '🍝', '🍷', '⭐', '🔥', '👻', '📺', '🚀', '❤️', '🏆'];
const COLOR_OPTIONS = [
  '#39ff14', // Neon Green
  '#ff2079', // Neon Pink
  '#00e5ff', // Neon Cyan
  '#ffe900', // Neon Yellow
  '#b946ff', // Neon Purple
  '#ff7700', // Neon Orange
  '#f5f5f5', // Arcade White
];

export function ShelfFormModal({
  isOpen,
  onClose,
  initialShelf = null, // if provided, we are renaming; otherwise creating
}) {
  const { createShelf, renameShelf, shelves } = useShelves();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📁');
  const [color, setColor] = useState('#39ff14');
  const [error, setError] = useState('');

  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const isRenaming = Boolean(initialShelf);

  useEffect(() => {
    if (isOpen) {
      if (initialShelf) {
        setName(initialShelf.name || '');
        setEmoji(initialShelf.emoji || '📁');
        setColor(initialShelf.color || '#7A1F2B');
      } else {
        setName('');
        setEmoji('📁');
        setColor('#7A1F2B');
      }
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialShelf]);

  // Handle ESC key and focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Shelf name is required.');
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length > 30) {
      setError('Shelf name must be 30 characters or fewer.');
      inputRef.current?.focus();
      return;
    }

    const isDuplicate = shelves.some(
      (s) =>
        s.name.toLowerCase() === trimmed.toLowerCase() &&
        (!isRenaming || s.id !== initialShelf?.id)
    );

    if (isDuplicate) {
      setError(`A shelf named "${trimmed}" already exists.`);
      inputRef.current?.focus();
      return;
    }

    try {
      if (isRenaming) {
        renameShelf(initialShelf.id, trimmed);
      } else {
        createShelf({ name: trimmed, emoji, color });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shelf-modal-title"
    >
      <div className="modal-card" ref={modalRef}>
        <div className="modal-header">
          <h3 id="shelf-modal-title">
            {isRenaming ? 'Rename Shelf' : 'Create New Shelf'}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              htmlFor="shelf-name-input"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: 'var(--space-2)',
                fontSize: '0.9rem',
              }}
            >
              Shelf Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="shelf-name-input"
              ref={inputRef}
              type="text"
              placeholder="e.g. Weekend Binge, Italian Classics"
              value={name}
              maxLength={30}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'shelf-name-error' : undefined}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--space-1)',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <span>{error ? <span id="shelf-name-error" style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{error}</span> : 'Must be unique (case-insensitive)'}</span>
              <span>{name.length}/30</span>
            </div>
          </div>

          {!isRenaming && (
            <>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: 'var(--space-2)',
                    fontSize: '0.9rem',
                  }}
                >
                  Pick an Icon
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      className="btn-secondary btn-sm"
                      style={{
                        fontSize: '1.2rem',
                        width: '40px',
                        minHeight: '40px',
                        padding: 0,
                        backgroundColor: emoji === em ? 'var(--color-surface-2)' : 'var(--color-surface)',
                        borderColor: emoji === em ? 'var(--color-primary)' : 'var(--color-border)',
                      }}
                      onClick={() => setEmoji(em)}
                      aria-label={`Select emoji ${em}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: 'var(--space-2)',
                    fontSize: '0.9rem',
                  }}
                >
                  Shelf Theme Color
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      style={{
                        backgroundColor: c,
                        width: '32px',
                        height: '32px',
                        minHeight: '32px',
                        borderRadius: '50%',
                        padding: 0,
                        border: color === c ? '3px solid var(--color-text)' : '2px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                      onClick={() => setColor(c)}
                      aria-label={`Select color ${c}`}
                    >
                      {color === c && <Check size={16} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isRenaming ? 'Save Changes' : 'Create Shelf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
