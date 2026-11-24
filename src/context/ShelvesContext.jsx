import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getStoredShelves,
  setStoredShelves,
  getStoredItems,
  setStoredItems,
} from '../services/storage';
import { useToast } from './ToastContext';

const ShelvesContext = createContext(null);

const DEFAULT_SHELF_IDS = ['watched', 'watching', 'want'];

// Helper to generate IDs for custom shelves
function generateId() {
  return 'shelf_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

function shelvesReducer(state, action) {
  switch (action.type) {
    case 'CREATE_SHELF': {
      const { name, emoji = '📁', color = '#7A1F2B' } = action.payload;
      const trimmedName = name.trim();

      const newShelf = {
        id: generateId(),
        name: trimmedName,
        isDefault: false,
        emoji,
        color,
        createdAt: Date.now(),
      };

      return {
        ...state,
        shelves: [...state.shelves, newShelf],
      };
    }

    case 'RENAME_SHELF': {
      const { shelfId, newName } = action.payload;
      const trimmedName = newName.trim();

      return {
        ...state,
        shelves: state.shelves.map((s) =>
          s.id === shelfId && !s.isDefault ? { ...s, name: trimmedName } : s
        ),
      };
    }

    case 'DELETE_SHELF': {
      const { shelfId } = action.payload;
      const targetShelf = state.shelves.find((s) => s.id === shelfId);

      if (!targetShelf || targetShelf.isDefault) {
        return state;
      }

      return {
        ...state,
        shelves: state.shelves.filter((s) => s.id !== shelfId),
        items: state.items.filter((item) => item.shelfId !== shelfId),
      };
    }

    case 'SET_DEFAULT_SHELF': {
      const { shelfId, title } = action.payload; // shelfId can be 'watched' | 'watching' | 'want' | null (to remove)
      const imdbID = title.imdbID;

      // Find current default shelf for this title
      const currentDefaultItem = state.items.find(
        (item) => item.imdbID === imdbID && DEFAULT_SHELF_IDS.includes(item.shelfId)
      );

      // Remove from any default shelf
      const withoutDefault = state.items.filter(
        (item) => !(item.imdbID === imdbID && DEFAULT_SHELF_IDS.includes(item.shelfId))
      );

      // If user selected the same shelf that it was already on, remove it
      if (currentDefaultItem && currentDefaultItem.shelfId === shelfId) {
        return {
          ...state,
          items: withoutDefault,
        };
      }

      // If setting a new default shelf
      if (shelfId) {
        const newItem = {
          shelfId,
          imdbID,
          addedAt: Date.now(),
          title: {
            imdbID: title.imdbID,
            Title: title.Title,
            Year: title.Year,
            Type: title.Type,
            Poster: title.Poster,
          },
        };
        return {
          ...state,
          items: [newItem, ...withoutDefault],
        };
      }

      return {
        ...state,
        items: withoutDefault,
      };
    }

    case 'TOGGLE_CUSTOM_SHELF': {
      const { shelfId, title } = action.payload;
      const imdbID = title.imdbID;

      const existingIndex = state.items.findIndex(
        (item) => item.imdbID === imdbID && item.shelfId === shelfId
      );

      if (existingIndex >= 0) {
        // Remove from this custom shelf
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.imdbID === imdbID && item.shelfId === shelfId)
          ),
        };
      } else {
        // Add to this custom shelf
        const newItem = {
          shelfId,
          imdbID,
          addedAt: Date.now(),
          title: {
            imdbID: title.imdbID,
            Title: title.Title,
            Year: title.Year,
            Type: title.Type,
            Poster: title.Poster,
          },
        };
        return {
          ...state,
          items: [newItem, ...state.items],
        };
      }
    }

    case 'REMOVE_ITEM_FROM_SHELF': {
      const { shelfId, imdbID } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.imdbID === imdbID && item.shelfId === shelfId)
        ),
      };
    }

    default:
      return state;
  }
}

export function ShelvesProvider({ children }) {
  const { addToast } = useToast();

  const [state, dispatch] = useReducer(shelvesReducer, null, () => ({
    shelves: getStoredShelves(),
    items: getStoredItems(),
  }));

  // Sync to localStorage
  useEffect(() => {
    setStoredShelves(state.shelves);
  }, [state.shelves]);

  useEffect(() => {
    setStoredItems(state.items);
  }, [state.items]);

  // Actions with validation and toasts
  const createShelf = ({ name, emoji, color }) => {
    const trimmed = name?.trim();
    if (!trimmed) {
      throw new Error('Shelf name is required.');
    }
    if (trimmed.length > 30) {
      throw new Error('Shelf name must be 30 characters or fewer.');
    }

    const duplicate = state.shelves.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`A shelf named "${trimmed}" already exists.`);
    }

    dispatch({
      type: 'CREATE_SHELF',
      payload: { name: trimmed, emoji, color },
    });

    addToast(`Shelf "${trimmed}" created!`, 'success');
  };

  const renameShelf = (shelfId, newName) => {
    const target = state.shelves.find((s) => s.id === shelfId);
    if (!target) {
      throw new Error('Shelf not found.');
    }
    if (target.isDefault) {
      throw new Error('Default shelves cannot be renamed.');
    }

    const trimmed = newName?.trim();
    if (!trimmed) {
      throw new Error('Shelf name is required.');
    }
    if (trimmed.length > 30) {
      throw new Error('Shelf name must be 30 characters or fewer.');
    }

    const duplicate = state.shelves.some(
      (s) => s.id !== shelfId && s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`A shelf named "${trimmed}" already exists.`);
    }

    dispatch({
      type: 'RENAME_SHELF',
      payload: { shelfId, newName: trimmed },
    });

    addToast(`Shelf renamed to "${trimmed}"`, 'success');
  };

  const deleteShelf = (shelfId) => {
    const target = state.shelves.find((s) => s.id === shelfId);
    if (!target) {
      throw new Error('Shelf not found.');
    }
    if (target.isDefault) {
      throw new Error('Default shelves cannot be deleted.');
    }

    dispatch({
      type: 'DELETE_SHELF',
      payload: { shelfId },
    });

    addToast(`Shelf "${target.name}" deleted`, 'info');
  };

  const setDefaultShelf = (targetShelfId, title) => {
    const targetShelf = state.shelves.find((s) => s.id === targetShelfId);
    const currentDefaultItem = state.items.find(
      (item) => item.imdbID === title.imdbID && DEFAULT_SHELF_IDS.includes(item.shelfId)
    );

    dispatch({
      type: 'SET_DEFAULT_SHELF',
      payload: { shelfId: targetShelfId, title },
    });

    if (currentDefaultItem && currentDefaultItem.shelfId === targetShelfId) {
      addToast(`Removed from ${targetShelf?.name || 'shelf'}`, 'info');
    } else if (currentDefaultItem) {
      addToast(`Moved to ${targetShelf?.name}`, 'success');
    } else if (targetShelf) {
      addToast(`Added to ${targetShelf.name}`, 'success');
    }
  };

  const toggleCustomShelf = (shelfId, title) => {
    const shelf = state.shelves.find((s) => s.id === shelfId);
    const isInShelf = state.items.some(
      (item) => item.imdbID === title.imdbID && item.shelfId === shelfId
    );

    dispatch({
      type: 'TOGGLE_CUSTOM_SHELF',
      payload: { shelfId, title },
    });

    if (isInShelf) {
      addToast(`Removed from ${shelf?.name || 'shelf'}`, 'info');
    } else {
      addToast(`Added to ${shelf?.name || 'shelf'}`, 'success');
    }
  };

  const removeItemFromShelf = (shelfId, imdbID) => {
    const shelf = state.shelves.find((s) => s.id === shelfId);
    dispatch({
      type: 'REMOVE_ITEM_FROM_SHELF',
      payload: { shelfId, imdbID },
    });
    addToast(`Removed from ${shelf?.name || 'shelf'}`, 'info');
  };

  // Helper queries
  const getItemShelves = (imdbID) => {
    return state.items
      .filter((item) => item.imdbID === imdbID)
      .map((item) => item.shelfId);
  };

  const isItemInShelf = (imdbID, shelfId) => {
    return state.items.some(
      (item) => item.imdbID === imdbID && item.shelfId === shelfId
    );
  };

  const getShelfItems = (shelfId) => {
    return state.items.filter((item) => item.shelfId === shelfId);
  };

  const getShelfStats = () => {
    const watchedCount = state.items.filter((i) => i.shelfId === 'watched').length;
    const watchingCount = state.items.filter((i) => i.shelfId === 'watching').length;
    const wantCount = state.items.filter((i) => i.shelfId === 'want').length;
    const uniqueTitles = new Set(state.items.map((i) => i.imdbID)).size;

    return {
      watchedCount,
      watchingCount,
      wantCount,
      uniqueTitles,
    };
  };

  return (
    <ShelvesContext.Provider
      value={{
        shelves: state.shelves,
        items: state.items,
        createShelf,
        renameShelf,
        deleteShelf,
        setDefaultShelf,
        toggleCustomShelf,
        removeItemFromShelf,
        getItemShelves,
        isItemInShelf,
        getShelfItems,
        getShelfStats,
      }}
    >
      {children}
    </ShelvesContext.Provider>
  );
}

export function useShelves() {
  const context = useContext(ShelvesContext);
  if (!context) {
    throw new Error('useShelves must be used within a ShelvesProvider');
  }
  return context;
}
