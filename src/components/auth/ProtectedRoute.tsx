import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { setAuthToken } from '@/lib/api';
import NotAvailable from '@/pages/NotAvailable';

export function ProtectedRoute() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  // Set auth token for API requests
  useEffect(() => {
    if (isSignedIn) {
      const updateToken = async () => {
        const token = await getToken();
        setAuthToken(token);
      };
      updateToken();
    }
  }, [isSignedIn, getToken]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show "Not Available" page instead of redirecting
  if (!isSignedIn) {
    return <NotAvailable />;
  }

  return <Outlet />;
}
