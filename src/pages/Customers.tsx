import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { customersApi } from '@/lib/api';
import { Trash2, Search, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  createdAt?: string;
  totalOrders?: number;
  totalSpent?: number;
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', status: 'active', createdAt: '2024-01-15', totalOrders: 12, totalSpent: 1250 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', status: 'active', createdAt: '2024-02-20', totalOrders: 8, totalSpent: 890 },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', status: 'active', createdAt: '2024-03-10', totalOrders: 25, totalSpent: 3200 },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', status: 'active', createdAt: '2024-01-25', totalOrders: 5, totalSpent: 450 },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', status: 'active', createdAt: '2024-04-05', totalOrders: 15, totalSpent: 1800 },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const response = await customersApi.getAll();
        return response.data;
      } catch {
        // Return mock data if API fails
        return mockCustomers;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete customer');
    },
  });

  // Filter only active customers
  const customers = (customersData || mockCustomers)
    .filter((c: Customer) => c.status === 'active')
    .filter((c: Customer) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Customers"
        description="Manage your active customers"
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        }
      />

      <div className="stat-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No active customers found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: Customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{customer.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{customer.createdAt || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium">{customer.totalOrders || 0}</span>
                  </td>
                  <td>
                    <span className="font-medium text-accent">${customer.totalSpent || 0}</span>
                  </td>
                  <td className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {customer.name}? This action will soft-delete the customer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(customer.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
