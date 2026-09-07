import { getTickets } from '../lib/mockPortalApi';
import { useAsyncData } from './useAsyncData';

export function useTickets() {
  return useAsyncData(getTickets, { refetchOnWindowFocus: true });
}
