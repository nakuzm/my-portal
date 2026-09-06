import { Dashboard } from './components/Dashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { AppHeader } from './components/layout/AppHeader';
import { AppMain } from './components/layout/AppMain';

function App() {
  return (
    <>
      <AppHeader>
        <div>
          <p className="text-label-small font-label-small text-text-secondary mb-1 uppercase">
            Portal Foundation
          </p>
          <h1 className="text-heading-1 font-heading-1 text-text-primary leading-tight">
            Account dashboard
          </h1>
        </div>

        <div className="flex items-end gap-4 max-lg:items-start">
          <NotificationCenter />
        </div>
      </AppHeader>

      <AppMain>
        <Dashboard />
      </AppMain>
    </>
  );
}

export default App;
