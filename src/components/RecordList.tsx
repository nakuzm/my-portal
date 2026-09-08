import { CardHeader, DashboardCard } from './DashboardCard';
import { CardError, CardSkeleton } from './CardState';
import { StatusBadge } from './StatusBadge';
import { StatusIndicator } from './StatusIndicator';
import {
  priorityLabels,
  shipmentStatusLabels,
  shipmentStatusTones,
  ticketStatusLabels,
  ticketStatusTones,
} from '../constants/labels';
import { useNotifications } from '@hooks/useNotifications';
import { useTickets } from '@hooks/useTickets';
import { useOrders } from '@hooks/useOrders';

export function TicketList() {
  const { data: tickets, error, isLoading } = useTickets();

  return (
    <DashboardCard aria-busy={isLoading}>
      <CardHeader title="Open service tickets" count={tickets?.length} />
      {isLoading && <CardSkeleton />}
      {error && !isLoading && <CardError title="Tickets unavailable" />}
      {tickets && !isLoading && !error && (
        <ul className="grid gap-3 p-0">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="dashboard-list-item min-h-[72px]">
              <div>
                <p className="dashboard-list-item-title">{ticket.title}</p>
                <span className="dashboard-list-item-meta">{ticket.id}</span>
              </div>
              <div className="grid justify-items-end gap-2 text-right max-sm:justify-items-start max-sm:text-left">
                <StatusBadge tone={ticket.priority}>
                  {priorityLabels[ticket.priority]}
                </StatusBadge>
                <span className="dashboard-list-item-meta inline-flex items-center gap-2">
                  <StatusIndicator tone={ticketStatusTones[ticket.status]} />
                  {ticketStatusLabels[ticket.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

export function OrderList() {
  const { data: orders, error, isLoading } = useOrders();

  return (
    <DashboardCard aria-busy={isLoading}>
      <CardHeader title="Recent orders" count={orders?.length} />
      {isLoading && <CardSkeleton />}
      {error && !isLoading && <CardError title="Orders unavailable" />}
      {orders && !isLoading && !error && (
        <ul className="grid gap-3 p-0">
          {orders.map((order) => (
            <li
              key={order.orderNumber}
              className="dashboard-list-item min-h-[72px]"
            >
              <div>
                <p className="dashboard-list-item-title">{order.description}</p>
                <span className="dashboard-list-item-meta">
                  {order.orderNumber}
                </span>
              </div>
              <div className="grid justify-items-end gap-2 text-right max-sm:justify-items-start max-sm:text-left">
                <strong>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(order.total)}
                </strong>
                <span className="dashboard-list-item-meta inline-flex items-center gap-2">
                  <StatusIndicator
                    tone={shipmentStatusTones[order.shipmentStatus]}
                  />
                  {shipmentStatusLabels[order.shipmentStatus]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

export function ActivityFlags() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <DashboardCard>
      <CardHeader title="Activity flags" count={unreadCount} />
      <ul className="grid gap-3 p-0">
        {notifications.slice(0, 3).map((notification) => (
          <li
            key={notification.id}
            className="dashboard-list-item min-h-[58px]"
          >
            <div>
              <p className="dashboard-list-item-title">{notification.title}</p>
              <span className="dashboard-list-item-meta">
                {notification.createdAt}
              </span>
            </div>
            <StatusBadge tone={notification.read ? 'success' : 'info'}>
              {notification.read ? 'Read' : 'Unread'}
            </StatusBadge>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
