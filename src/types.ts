export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TicketStatus = 'investigating' | 'waiting-on-customer' | 'resolved';
export type ShipmentStatus = 'preparing' | 'in-transit' | 'delivered';
export type StatusTone = 'active' | 'inactive' | 'pending' | 'error' | 'info';
export type NotificationType =
  'incident' | 'order' | 'security' | 'maintenance';
export type SearchSource =
  'products' | 'knowledge-articles' | 'support-tickets';

export type CustomerInfo = {
  name: string;
  accountId: string;
  organization: string;
  tier: string;
  serviceManager: string;
  renewalDate: string;
};

export type ServiceTicket = {
  id: string;
  title: string;
  status: TicketStatus;
  priority: Priority;
  updatedAt: string;
};

export type Order = {
  orderNumber: string;
  description: string;
  total: number;
  shipmentStatus: ShipmentStatus;
  eta: string;
};

export type PortalNotification = {
  id: string;
  title: string;
  detail: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
};

export type SearchResult = {
  id: string;
  source: SearchSource;
  title: string;
  detail: string;
};
