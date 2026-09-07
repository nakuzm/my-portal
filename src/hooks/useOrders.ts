import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../lib/mockPortalApi';

export function useOrders() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 60_000,
  });

  return { data: data ?? null, error, isLoading };
}
