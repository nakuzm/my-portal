import { AccountSummary } from './AccountSummary';
import { GlobalSearch } from './GlobalSearch';
import { ActivityFlags, OrderList, TicketList } from './RecordList';

export function Dashboard() {
  return (
    <section
      className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-5 max-xl:grid-cols-[minmax(0,1fr)_330px] max-lg:grid-cols-1"
      aria-label="Dashboard overview"
    >
      <div className="grid min-w-0 gap-5">
        <GlobalSearch />
        <TicketList />
        <OrderList />
        <ActivityFlags />
      </div>

      <aside className="sticky top-5 max-lg:static">
        <AccountSummary className="min-h-[calc(100svh-168px)] max-lg:min-h-0" />
      </aside>
    </section>
  );
}
