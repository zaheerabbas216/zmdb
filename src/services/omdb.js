// Base URL for OMDb API. Can be updated to a proxy route (e.g., /api/omdb) in production
const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = '1be518dd';

// In-memory cache for search queries and title details
const searchCache = new Map();
const detailsCache = new Map();

/**
 * Get active OMDb API key
 */
export function getApiKey() {
  const envKey = import.meta.env.VITE_OMDB_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }
  return OMDB_API_KEY;
}

/**
 * Check if API key is configured
 */
export function hasApiKey() {
  return true;
}

/**
 * Search movies and series on OMDb
 * @param {Object} options
 * @param {string} options.query - Search query string
 * @param {string} [options.type] - "movie" | "series" | ""
 * @param {string} [options.year] - Release year e.g. "2023"
 * @param {number} [options.page=1] - Page number (1-based, 10 items/page)
 * @param {AbortSignal} [options.signal] - AbortSignal for request cancellation
 * @returns {Promise<{ titles: Array, totalResults: number, page: number }>}
 */
export async function searchTitles({ query, type = '', year = '', page = 1, signal }) {
  const apiKey = getApiKey();
  const trimmedQuery = query?.trim();
  if (!trimmedQuery || trimmedQuery.length < 2) {
    return { titles: [], totalResults: 0, page: 1 };
  }

  const cacheKey = `${trimmedQuery.toLowerCase()}_type=${type}_y=${year}_page=${page}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    s: trimmedQuery,
    page: String(page),
  });

  if (type) {
    params.set('type', type);
  }
  if (year) {
    params.set('y', year);
  }

  const url = `${OMDB_BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (data.Response === 'False') {
      if (data.Error && (data.Error.includes('Invalid API key') || data.Error.includes('No API key provided'))) {
        throw new Error(`OMDb Error: ${data.Error}`);
      }

      return {
        titles: [],
        totalResults: 0,
        page,
        error: data.Error || 'No results found',
      };
    }

    const result = {
      titles: data.Search || [],
      totalResults: parseInt(data.totalResults, 10) || 0,
      page,
      error: null,
    };

    searchCache.set(cacheKey, result);
    return result;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.error('Error fetching search results from OMDb:', err);
    throw err;
  }
}

/**
 * Get title details by imdbID
 * @param {string} imdbID
 * @param {Object} [options]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Object>}
 */
export async function getTitleDetails(imdbID, { signal } = {}) {
  const apiKey = getApiKey();
  if (!imdbID) {
    throw new Error('Valid IMDb ID is required.');
  }

  if (detailsCache.has(imdbID)) {
    return detailsCache.get(imdbID);
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    i: imdbID,
    plot: 'full',
  });

  const url = `${OMDB_BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Failed to fetch title details.');
    }

    detailsCache.set(imdbID, data);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.error(`Error fetching title details for ${imdbID}:`, err);
    throw err;
  }
}
