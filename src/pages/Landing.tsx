import { SignInButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Store, BarChart3, Package, Users, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">ShopAdmin</span>
          </div>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
          E-Commerce Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Manage your inventory, orders, payments, and customers with a powerful and intuitive dashboard.
        </p>
        <SignInButton mode="modal">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started
          </Button>
        </SignInButton>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={BarChart3}
            title="Analytics"
            description="Track orders, revenue, and business metrics in real-time."
          />
          <FeatureCard
            icon={Package}
            title="Inventory"
            description="Manage products with easy upload and modification."
          />
          <FeatureCard
            icon={Users}
            title="Customers"
            description="View and manage your customer base efficiently."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Secure"
            description="Enterprise-grade security with Clerk authentication."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="stat-card text-center">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
