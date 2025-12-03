import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown, Send, Loader2 } from 'lucide-react';
import { useRecentPayments, useStudentsWithUnpaidFees, useStudents } from '@/hooks/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const FinancesPage = () => {
  const { data: recentPayments, isLoading: paymentsLoading } = useRecentPayments(10);
  const { data: studentsWithUnpaidFees, isLoading: unpaidLoading } = useStudentsWithUnpaidFees();
  const { data: allStudents, isLoading: studentsLoading } = useStudents();

  const stats = useMemo(() => {
    const totalCollected = recentPayments?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;
    const totalPending = studentsWithUnpaidFees?.reduce((acc, student) => {
      const unpaidTotal = student.fees?.reduce((sum: number, fee: { status: string; amount: number | string }) => {
        if (fee.status !== 'paid') return sum + Number(fee.amount);
        return sum;
      }, 0) || 0;
      return acc + unpaidTotal;
    }, 0) || 0;

    const paidStudents = allStudents?.filter(s => {
      const hasUnpaidFees = s.fees?.some((fee: { status: string }) => fee.status !== 'paid');
      return !hasUnpaidFees;
    }).length || 0;

    const overdueStudents = studentsWithUnpaidFees?.filter(s => {
      return s.fees?.some((fee: { status: string; due_date: string }) => 
        fee.status === 'overdue' || (new Date(fee.due_date) < new Date() && fee.status !== 'paid')
      );
    }).length || 0;

    return { totalCollected, totalPending, paidStudents, overdueStudents };
  }, [recentPayments, studentsWithUnpaidFees, allStudents]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financial Overview</h1>
        <p className="text-muted-foreground">Track fee payments and outstanding dues</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Collected" 
          value={paymentsLoading ? '...' : `$${stats.totalCollected.toLocaleString()}`} 
          icon={TrendingUp} 
          variant="success"
        />
        <StatsCard 
          title="Pending Dues" 
          value={unpaidLoading ? '...' : `$${stats.totalPending.toLocaleString()}`} 
          icon={TrendingDown} 
          variant="destructive"
        />
        <StatsCard 
          title="Paid Students" 
          value={studentsLoading ? '...' : stats.paidStudents} 
          icon={DollarSign}
        />
        <StatsCard 
          title="Overdue Accounts" 
          value={unpaidLoading ? '...' : stats.overdueStudents} 
          icon={DollarSign} 
          variant="warning"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !recentPayments || recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent payments.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.students?.full_name || 'Unknown'}</TableCell>
                      <TableCell>${Number(payment.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.paid_date ? format(new Date(payment.paid_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30">
                          Paid
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Unpaid Dues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Outstanding Dues</CardTitle>
          </CardHeader>
          <CardContent>
            {unpaidLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !studentsWithUnpaidFees || studentsWithUnpaidFees.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No outstanding dues.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsWithUnpaidFees.map((student) => {
                    const unpaidAmount = student.fees?.reduce((sum: number, fee: { status: string; amount: number | string }) => {
                      if (fee.status !== 'paid') return sum + Number(fee.amount);
                      return sum;
                    }, 0) || 0;
                    
                    const hasOverdue = student.fees?.some((fee: { status: string; due_date: string }) => 
                      fee.status === 'overdue' || (new Date(fee.due_date) < new Date() && fee.status !== 'paid')
                    );

                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.full_name}</p>
                            <p className="text-xs text-muted-foreground">{student.class}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">${unpaidAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              "capitalize",
                              hasOverdue 
                                ? "bg-destructive/10 text-destructive border-destructive/30" 
                                : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30"
                            )}
                          >
                            {hasOverdue ? 'overdue' : 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Remind
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancesPage;
