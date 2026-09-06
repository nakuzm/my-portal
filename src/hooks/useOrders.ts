import { getOrders } from '../lib/mockPortalApi';
import { useAsyncData } from './useAsyncData';

export function useOrders() {
  return useAsyncData(getOrders);
}
