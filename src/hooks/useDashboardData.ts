import { useCustomer } from './useCustomer';
import { useOrders } from './useOrders';
import { useTickets } from './useTickets';

export function useDashboardData() {
  return {
    customer: useCustomer(),
    tickets: useTickets(),
    orders: useOrders(),
  };
}
