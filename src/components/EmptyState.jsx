import React from 'react';
import { Film, Plus } from 'lucide-react';

export function EmptyState({
  icon: Icon = Film,
  title = 'No items found',
  description = 'Your shelf or search results are currently empty.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={36} />
      </div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn-primary"
          onClick={onAction}
          style={{ marginTop: 'var(--space-2)' }}
        >
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
