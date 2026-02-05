import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { ShoppingCart, XCircle, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { ordersApi, paymentsApi } from '@/lib/api';

// Mock data for charts
const ordersPlacedData = [
  { name: 'Mon', orders: 45 },
  { name: 'Tue', orders: 52 },
  { name: 'Wed', orders: 38 },
  { name: 'Thu', orders: 65 },
  { name: 'Fri', orders: 78 },
  { name: 'Sat', orders: 90 },
  { name: 'Sun', orders: 67 },
];

const ordersCancelledData = [
  { name: 'Mon', cancelled: 3 },
  { name: 'Tue', cancelled: 5 },
  { name: 'Wed', cancelled: 2 },
  { name: 'Thu', cancelled: 4 },
  { name: 'Fri', cancelled: 6 },
  { name: 'Sat', cancelled: 3 },
  { name: 'Sun', cancelled: 2 },
];

const paymentsData = [
  { name: 'Mon', amount: 4500 },
  { name: 'Tue', amount: 5200 },
  { name: 'Wed', amount: 3800 },
  { name: 'Thu', amount: 6500 },
  { name: 'Fri', amount: 7800 },
  { name: 'Sat', amount: 9000 },
  { name: 'Sun', amount: 6700 },
];

export default function Dashboard() {
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAll(),
  });

  const { data: paymentsApiData, isLoading: paymentsLoading, error: paymentsError } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.getAll(),
  });

  // Data is already unwrapped and guaranteed to be an array by api.ts
  const orders = Array.isArray(ordersData) ? ordersData : [];
  const payments = Array.isArray(paymentsApiData) ? paymentsApiData : [];

  // Calculate totals from API data
  const totalOrders = orders.length;
  const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length;
  const totalPayments = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const isLoading = ordersLoading || paymentsLoading;
  const hasError = ordersError || paymentsError;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your store's performance"
      />

      {hasError && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load some data. Please check your backend connection.</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={isLoading ? '...' : totalOrders.toLocaleString()}
          change="+12.5%"
          icon={ShoppingCart}
          color="primary"
        />
        <StatCard
          title="Cancelled Orders"
          value={isLoading ? '...' : cancelledOrders.toLocaleString()}
          change="-3.2%"
          icon={XCircle}
          color="destructive"
        />
        <StatCard
          title="Total Revenue"
          value={isLoading ? '...' : `$${totalPayments.toLocaleString()}`}
          change="+18.7%"
          icon={DollarSign}
          color="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Orders Placed" subtitle="Last 7 days">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ordersPlacedData}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--primary))"
                fill="url(#ordersGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders Cancelled" subtitle="Last 7 days">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersCancelledData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Payments Received" subtitle="Revenue trend for the last 7 days">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={paymentsData}>
            <defs>
              <linearGradient id="paymentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--accent))"
              fill="url(#paymentsGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: 'primary' | 'destructive' | 'accent';
}) {
  const isPositive = change.startsWith('+');
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    destructive: 'bg-destructive/10 text-destructive',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
          <TrendingUp className={`w-4 h-4 ${!isPositive && 'rotate-180'}`} />
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="stat-card">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
