import { getCustomer } from '../lib/mockPortalApi';
import { useAsyncData } from './useAsyncData';

export function useCustomer() {
  return useAsyncData(getCustomer);
}
