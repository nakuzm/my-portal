import type {
  Priority,
  SearchSource,
  ShipmentStatus,
  StatusTone,
  TicketStatus,
} from '../types';

export const priorityLabels: Record<Priority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const ticketStatusLabels: Record<TicketStatus, string> = {
  investigating: 'Investigating',
  'waiting-on-customer': 'Waiting on customer',
  resolved: 'Resolved',
};

export const ticketStatusTones: Record<TicketStatus, StatusTone> = {
  investigating: 'info',
  'waiting-on-customer': 'pending',
  resolved: 'active',
};

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  preparing: 'Preparing',
  'in-transit': 'In transit',
  delivered: 'Delivered',
};

export const shipmentStatusTones: Record<ShipmentStatus, StatusTone> = {
  preparing: 'pending',
  'in-transit': 'info',
  delivered: 'active',
};

export const searchSourceLabels: Record<SearchSource, string> = {
  products: 'Products',
  'knowledge-articles': 'Knowledge Articles',
  'support-tickets': 'Support Tickets',
};
