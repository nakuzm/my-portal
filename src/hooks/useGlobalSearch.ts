import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  searchKnowledgeArticles,
  searchProducts,
  searchSupportTickets,
} from '../lib/mockPortalApi';
import { useDebouncedValue } from './useDebouncedValue';

export function useGlobalSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), 180);
  const isEnabled = debouncedQuery.length >= 2;

  const { data = [], isFetching } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: async ({ signal }) => {
      const resultsBySource = await Promise.all([
        searchProducts(debouncedQuery, signal),
        searchKnowledgeArticles(debouncedQuery, signal),
        searchSupportTickets(debouncedQuery, signal),
      ]);

      return resultsBySource.flat();
    },
    enabled: isEnabled,
    placeholderData: keepPreviousData,
  });

  return {
    results: isEnabled ? data : [],
    isSearching: isEnabled && isFetching,
  };
}
