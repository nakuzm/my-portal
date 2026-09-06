import type {
  CustomerInfo,
  Order,
  PortalNotification,
  SearchResult,
  SearchSource,
  ServiceTicket,
} from '../types';
import { delay } from './delay';

const customerInfo: CustomerInfo = {
  name: 'Nordic Manufacturing Group',
  accountId: 'AC-10492',
  organization: 'Enterprise Cloud Operations',
  tier: 'Strategic',
  serviceManager: 'Elena Martins',
  renewalDate: '2027-04-18',
};

const serviceTickets: ServiceTicket[] = [
  {
    id: 'TCK-44921',
    title: 'VPN packet loss in Riga office',
    status: 'investigating',
    priority: 'critical',
    updatedAt: '12 min ago',
  },
  {
    id: 'TCK-44888',
    title: 'Backup policy review',
    status: 'waiting-on-customer',
    priority: 'medium',
    updatedAt: '2 hr ago',
  },
  {
    id: 'TCK-44862',
    title: 'Identity sync warning',
    status: 'resolved',
    priority: 'low',
    updatedAt: 'Yesterday',
  },
];

const recentOrders: Order[] = [
  {
    orderNumber: 'ORD-77201',
    description: 'Azure reserved capacity',
    total: 18420,
    shipmentStatus: 'delivered',
    eta: 'Completed',
  },
  {
    orderNumber: 'ORD-77184',
    description: 'Network edge appliances',
    total: 6290,
    shipmentStatus: 'in-transit',
    eta: 'Sep 9',
  },
  {
    orderNumber: 'ORD-77112',
    description: 'Endpoint security licenses',
    total: 3715,
    shipmentStatus: 'preparing',
    eta: 'Sep 12',
  },
];

export const initialNotifications: PortalNotification[] = [
  {
    id: 'NTF-001',
    title: 'Critical ticket updated',
    detail: 'TCK-44921 received a network engineer response.',
    type: 'incident',
    createdAt: '5 min ago',
    read: false,
  },
  {
    id: 'NTF-002',
    title: 'Order shipped',
    detail: 'ORD-77184 is in transit from the warehouse.',
    type: 'order',
    createdAt: '44 min ago',
    read: false,
  },
  {
    id: 'NTF-003',
    title: 'Security advisory',
    detail: 'New hardening recommendation published for edge appliances.',
    type: 'security',
    createdAt: 'Today',
    read: false,
  },
  {
    id: 'NTF-004',
    title: 'Maintenance window complete',
    detail: 'Scheduled maintenance for identity services is complete.',
    type: 'maintenance',
    createdAt: 'Yesterday',
    read: true,
  },
];

const delayedNotifications: PortalNotification[] = [
  {
    id: 'NTF-005',
    title: 'New knowledge article',
    detail: 'A fresh runbook was added for endpoint security rollout.',
    type: 'maintenance',
    createdAt: 'Just now',
    read: false,
  },
];

const mockStartedAt = Date.now();

const products: SearchResult[] = [
  {
    id: 'PRD-100',
    source: 'products',
    title: 'Managed Cloud Landing Zone',
    detail:
      'Governed Azure foundation with policy, networking, and monitoring.',
  },
  {
    id: 'PRD-204',
    source: 'products',
    title: 'Endpoint Security Suite',
    detail:
      'Device protection, vulnerability management, and incident telemetry.',
  },
];

const knowledgeArticles: SearchResult[] = [
  {
    id: 'KB-801',
    source: 'knowledge-articles',
    title: 'Troubleshoot VPN packet loss',
    detail: 'Diagnostics checklist for SD-WAN and branch connectivity.',
  },
  {
    id: 'KB-814',
    source: 'knowledge-articles',
    title: 'Backup policy retention model',
    detail: 'How retention tiers map to enterprise compliance controls.',
  },
];

const supportTicketSearchResults: SearchResult[] = [
  {
    id: 'TCK-44921',
    source: 'support-tickets',
    title: 'VPN packet loss in Riga office',
    detail: 'Critical incident currently under investigation.',
  },
  {
    id: 'TCK-44888',
    source: 'support-tickets',
    title: 'Backup policy review',
    detail: 'Waiting for customer approval on proposed schedule.',
  },
];

const sourceLatency: Record<SearchSource, number> = {
  products: 280,
  'knowledge-articles': 360,
  'support-tickets': 240,
};

export async function getCustomer(): Promise<CustomerInfo> {
  await delay(220);
  return customerInfo;
}

export async function getTickets(): Promise<ServiceTicket[]> {
  await delay(320);
  return serviceTickets;
}

export async function getOrders(): Promise<Order[]> {
  await delay(260);
  return recentOrders;
}

export async function getNotifications(): Promise<PortalNotification[]> {
  await delay(180);
  const shouldIncludeLatest = Date.now() - mockStartedAt > 20_000;

  return shouldIncludeLatest
    ? [...delayedNotifications, ...initialNotifications]
    : initialNotifications;
}

export async function markNotificationRead(
  notificationId: string,
): Promise<string> {
  await delay(120);
  return notificationId;
}

function filterSearchResults(
  items: SearchResult[],
  query: string,
): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) =>
    `${item.id} ${item.title} ${item.detail}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export async function searchProducts(
  query: string,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  await delay(sourceLatency.products, signal);
  return filterSearchResults(products, query);
}

export async function searchKnowledgeArticles(
  query: string,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  await delay(sourceLatency['knowledge-articles'], signal);
  return filterSearchResults(knowledgeArticles, query);
}

export async function searchSupportTickets(
  query: string,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  await delay(sourceLatency['support-tickets'], signal);
  return filterSearchResults(supportTicketSearchResults, query);
}
