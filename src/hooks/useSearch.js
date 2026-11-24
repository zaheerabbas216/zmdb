import { useState, useRef, useCallback } from 'react';
import { searchTitles } from '../services/omdb';

export function useSearch(initialQuery = '', initialType = '', initialYear = '', initialPage = 1) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [year, setYear] = useState(initialYear);
  const [page, setPage] = useState(initialPage);

  const [titles, setTitles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const executeSearch = useCallback(async (q, t, y, p, isLoadMore = false) => {
    const trimmed = q?.trim();
    if (!trimmed || trimmed.length < 2) {
      setTitles([]);
      setTotalResults(0);
      setError(null);
      setIsLoading(false);
      setIsLoadingMore(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const data = await searchTitles({
        query: trimmed,
        type: t,
        year: y,
        page: p,
        signal: controller.signal,
      });

      if (data.error) {
        if (!isLoadMore) {
          setTitles([]);
          setTotalResults(0);
        }
        setError(data.error);
      } else {
        setError(null);
        setTotalResults(data.totalResults);
        setTitles((prev) => (isLoadMore ? [...prev, ...data.titles] : data.titles));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch search results.');
        if (!isLoadMore) {
          setTitles([]);
          setTotalResults(0);
        }
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    executeSearch(query, type, year, nextPage, true);
  }, [isLoading, isLoadingMore, page, query, type, year, executeSearch]);

  const retry = useCallback(() => {
    executeSearch(query, type, year, page, false);
  }, [query, type, year, page, executeSearch]);

  return {
    query,
    setQuery,
    type,
    setType,
    year,
    setYear,
    page,
    setPage,
    titles,
    setTitles,
    totalResults,
    isLoading,
    isLoadingMore,
    error,
    hasMore: titles.length < totalResults,
    executeSearch,
    loadMore,
    retry,
  };
}
