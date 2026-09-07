import { useQuery } from '@tanstack/react-query';
import { getTickets } from '../lib/mockPortalApi';

export function useTickets() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
    staleTime: 60_000,
  });

  return { data: data ?? null, error, isLoading };
}
