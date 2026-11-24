import React, { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { useShelves } from '../context/ShelvesContext';
import { ShelfCard } from '../components/ShelfCard';
import { ShelfFormModal } from '../components/ShelfFormModal';

export function Shelves() {
  const { shelves, getShelfItems } = useShelves();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultShelves = shelves.filter((s) => s.isDefault);
  const customShelves = shelves.filter((s) => !s.isDefault);

  return (
    <div className="section">
      <div className="container">
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div>
            <span className="section-label">Your Cellar & Catalog</span>
            <h1 style={{ margin: 0 }}>My Movie Shelves</h1>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            Create New Shelf
          </button>
        </div>

        {/* Section 1: Default Shelves */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span className="section-label">Core Status Shelves</span>
            <h2 style={{ fontSize: '1.4rem' }}>Primary Tracking</h2>
          </div>

          <div className="shelves-grid">
            {defaultShelves.map((shelf) => (
              <ShelfCard
                key={shelf.id}
                shelf={shelf}
                items={getShelfItems(shelf.id)}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Custom Shelves */}
        <div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span className="section-label">Tailored Collections</span>
            <h2 style={{ fontSize: '1.4rem' }}>Custom Shelves</h2>
          </div>

          {customShelves.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8) var(--space-4)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <FolderPlus size={28} />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>No Custom Shelves Yet</h3>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  maxWidth: '440px',
                  margin: '0 auto var(--space-4)',
                  fontSize: '0.95rem',
                }}
              >
                Organize marathons, genre nights, family picks, or holiday specials by creating your own customized shelves.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={18} />
                Create Your First Custom Shelf
              </button>
            </div>
          ) : (
            <div className="shelves-grid">
              {customShelves.map((shelf) => (
                <ShelfCard
                  key={shelf.id}
                  shelf={shelf}
                  items={getShelfItems(shelf.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ShelfFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
