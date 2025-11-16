import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { searchService, SearchableAdventure, SearchResult } from '../services/searchService';

export interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  hasQuery: boolean;
}

export function useSearch(
  adventures: SearchableAdventure[],
  options: UseSearchOptions = {}
): UseSearchReturn {
  const { debounceMs = 300, minQueryLength = 2 } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, debounceMs);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (adventures.length > 0) {
      searchService.initialize(adventures);
    }

    return () => {
      searchService.clear();
    };
  }, [adventures]);

  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [query, debouncedQuery]);

  const results = useMemo(() => {
    if (debouncedQuery.length < minQueryLength) {
      return [];
    }
    return searchService.search(debouncedQuery);
  }, [debouncedQuery, minQueryLength]);

  const hasQuery = query.trim().length >= minQueryLength;

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasQuery,
  };
}
