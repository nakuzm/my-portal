import { useEffect, useState } from 'react';
import {
  searchKnowledgeArticles,
  searchProducts,
  searchSupportTickets,
} from '../lib/mockPortalApi';
import type { SearchResult } from '../types';
import { useDebouncedValue } from './useDebouncedValue';

export function useGlobalSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), 180);
  const isEnabled = debouncedQuery.length >= 2;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    if (!isEnabled) {
      return () => controller.abort();
    }

    async function search() {
      await Promise.resolve();

      if (controller.signal.aborted) {
        return;
      }

      setIsSearching(true);

      try {
        const resultsBySource = await Promise.all([
          searchProducts(debouncedQuery, controller.signal),
          searchKnowledgeArticles(debouncedQuery, controller.signal),
          searchSupportTickets(debouncedQuery, controller.signal),
        ]);

        setResults(resultsBySource.flat());
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }

    search();

    return () => controller.abort();
  }, [debouncedQuery, isEnabled]);

  return {
    results: isEnabled ? results : [],
    isSearching: isEnabled && isSearching,
  };
}
