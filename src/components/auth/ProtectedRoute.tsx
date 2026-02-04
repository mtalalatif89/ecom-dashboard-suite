import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { setAuthToken } from '@/lib/api';

export function ProtectedRoute() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/');
    }
  }, [isLoaded, isSignedIn, navigate]);

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

  if (!isSignedIn) {
    return null;
  }

  return <Outlet />;
}
