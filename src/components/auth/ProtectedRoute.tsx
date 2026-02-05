import { useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { injectAuth, setAuthToken } from '@/lib/api';
import NotAvailable from '@/pages/NotAvailable';

export function ProtectedRoute() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  // Memoize the token getter for the interceptor
  const tokenGetter = useCallback(async () => {
    return await getToken();
  }, [getToken]);

  // Inject auth into API module and set initial token
  useEffect(() => {
    if (isSignedIn) {
      // Inject the token getter for the request interceptor
      injectAuth(tokenGetter);
      
      // Also set the initial token for immediate use
      const updateToken = async () => {
        const token = await getToken();
        setAuthToken(token);
      };
      updateToken();
    }
  }, [isSignedIn, getToken, tokenGetter]);

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
