import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { paymentsApi } from '@/lib/api';
import { Search, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: string;
  status: string;
  createdAt?: string;
}

// Mock data for demonstration
const mockPayments: Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-001', customerName: 'John Doe', amount: 299, method: 'Credit Card', status: 'completed', createdAt: '2024-04-10' },
  { id: 'PAY-002', orderId: 'ORD-002', customerName: 'Jane Smith', amount: 398, method: 'PayPal', status: 'completed', createdAt: '2024-04-12' },
  { id: 'PAY-003', orderId: 'ORD-003', customerName: 'Bob Wilson', amount: 129, method: 'Credit Card', status: 'pending', createdAt: '2024-04-13' },
  { id: 'PAY-004', orderId: 'ORD-004', customerName: 'Alice Brown', amount: 148, method: 'Debit Card', status: 'completed', createdAt: '2024-04-14' },
  { id: 'PAY-005', orderId: 'ORD-005', customerName: 'Charlie Davis', amount: 597, method: 'Credit Card', status: 'completed', createdAt: '2024-04-15' },
  { id: 'PAY-006', orderId: 'ORD-006', customerName: 'Eve Johnson', amount: 250, method: 'Credit Card', status: 'refunded', createdAt: '2024-04-08' },
  { id: 'PAY-007', orderId: 'ORD-007', customerName: 'Frank Miller', amount: 175, method: 'PayPal', status: 'failed', createdAt: '2024-04-09' },
];

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      try {
        const response = await paymentsApi.getAll();
        return response.data;
      } catch {
        return mockPayments;
      }
    },
  });

  // Show all payments including those from cancelled orders for accounting transparency
  const payments = (paymentsData || mockPayments).filter((p: Payment) =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'failed': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'refunded': return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'info';
    }
  };

  const getMethodIcon = (method: string) => {
    return <CreditCard className="w-4 h-4 text-muted-foreground" />;
  };

  // Calculate summary
  const totalRevenue = payments.filter((p: Payment) => p.status === 'completed').reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const pendingAmount = payments.filter((p: Payment) => p.status === 'pending').reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const refundedAmount = payments.filter((p: Payment) => p.status === 'refunded').reduce((sum: number, p: Payment) => sum + p.amount, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Payments"
        description="View all payment transactions"
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-foreground">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <XCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Refunded</p>
              <p className="text-xl font-bold text-foreground">${refundedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No payments found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: Payment) => (
                <tr key={payment.id}>
                  <td>
                    <span className="font-mono text-sm font-medium">{payment.id}</span>
                  </td>
                  <td>
                    <span className="font-mono text-sm text-muted-foreground">{payment.orderId}</span>
                  </td>
                  <td>
                    <span className="font-medium text-foreground">{payment.customerName}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(payment.method)}
                      <span className="text-sm">{payment.method}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium">${payment.amount.toFixed(2)}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`status-badge ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-muted-foreground">{payment.createdAt || 'N/A'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
