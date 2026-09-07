import { useQuery } from '@tanstack/react-query';
import { getCustomer } from '../lib/mockPortalApi';

export function useCustomer() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['customer'],
    queryFn: getCustomer,
    staleTime: 60_000,
  });

  return { data: data ?? null, error, isLoading };
}
