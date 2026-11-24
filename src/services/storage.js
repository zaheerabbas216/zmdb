const SHELVES_KEY = 'zmdb:v1:shelves';
const ITEMS_KEY = 'zmdb:v1:items';
const API_KEY_STORAGE = 'zmdb:v1:custom_api_key';

export const DEFAULT_SHELVES = [
  {
    id: 'watched',
    name: 'Watched',
    isDefault: true,
    emoji: '✅',
    color: '#39ff14',
    createdAt: 1700000000000,
  },
  {
    id: 'watching',
    name: 'Watching',
    isDefault: true,
    emoji: '🍿',
    color: '#ffe900',
    createdAt: 1700000001000,
  },
  {
    id: 'want',
    name: 'Want to Watch',
    isDefault: true,
    emoji: '📌',
    color: '#ff2079',
    createdAt: 1700000002000,
  },
];

export function getStoredShelves() {
  try {
    const raw = localStorage.getItem(SHELVES_KEY);
    if (!raw) {
      setStoredShelves(DEFAULT_SHELVES);
      return DEFAULT_SHELVES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setStoredShelves(DEFAULT_SHELVES);
      return DEFAULT_SHELVES;
    }

    // Ensure default shelves are always present
    const hasDefaults = DEFAULT_SHELVES.every((def) =>
      parsed.some((s) => s.id === def.id)
    );

    if (!hasDefaults) {
      const merged = [
        ...DEFAULT_SHELVES,
        ...parsed.filter((p) => !DEFAULT_SHELVES.some((def) => def.id === p.id)),
      ];
      setStoredShelves(merged);
      return merged;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to read shelves from localStorage:', error);
    return DEFAULT_SHELVES;
  }
}

export function setStoredShelves(shelves) {
  try {
    localStorage.setItem(SHELVES_KEY, JSON.stringify(shelves));
  } catch (error) {
    console.error('Failed to save shelves to localStorage:', error);
  }
}

export function getStoredItems() {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read items from localStorage:', error);
    return [];
  }
}

export function setStoredItems(items) {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save items to localStorage:', error);
  }
}

export function getStoredApiKey() {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key) {
  try {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  } catch (error) {
    console.error('Failed to save custom api key:', error);
  }
}
