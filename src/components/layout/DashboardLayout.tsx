import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
