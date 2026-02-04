import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotAvailable = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">
          This page is not available. Please sign in to access the dashboard.
        </p>
        <Button asChild>
          <a href="/">Go to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotAvailable;
