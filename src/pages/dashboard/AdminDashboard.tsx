import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Users, 
  UserCog, 
  BookOpen, 
  DollarSign, 
  Bell,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { useStudents, useTeachers, useAnnouncements, useRecentPayments, useStudentsWithUnpaidFees, useClasses } from '@/hooks/api';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();
  const { data: recentPayments, isLoading: paymentsLoading } = useRecentPayments(4);
  const { data: studentsWithUnpaidFees, isLoading: unpaidFeesLoading } = useStudentsWithUnpaidFees();
  const { data: classes, isLoading: classesLoading } = useClasses();

  const totalFeesPending = useMemo(() => {
    if (!studentsWithUnpaidFees) return 0;
    return studentsWithUnpaidFees.reduce((acc, student) => {
      const unpaidTotal = student.fees?.reduce((sum: number, fee: { status: string; amount: number | string }) => {
        if (fee.status !== 'paid') {
          return sum + Number(fee.amount);
        }
        return sum;
      }, 0) || 0;
      return acc + unpaidTotal;
    }, 0);
  }, [studentsWithUnpaidFees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your school.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Students" 
          value={studentsLoading ? '...' : students?.length || 0} 
          icon={Users} 
          trend="+12% from last month"
          trendUp
        />
        <StatsCard 
          title="Total Teachers" 
          value={teachersLoading ? '...' : teachers?.length || 0} 
          icon={UserCog} 
          variant="success"
        />
        <StatsCard 
          title="Total Classes" 
          value={classesLoading ? '...' : classes?.length || 0} 
          icon={BookOpen} 
          variant="warning"
        />
        <StatsCard 
          title="Fees Pending" 
          value={unpaidFeesLoading ? '...' : `$${totalFeesPending.toLocaleString()}`} 
          icon={DollarSign} 
          variant="destructive"
          trend={`${studentsWithUnpaidFees?.length || 0} students`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Announcements</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/announcements')}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcementsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !announcements || announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
            ) : (
              announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Fee Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Students with Unpaid Dues</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/finances')}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {unpaidFeesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !studentsWithUnpaidFees || studentsWithUnpaidFees.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No unpaid fees.</p>
            ) : (
              <div className="space-y-3">
                {studentsWithUnpaidFees.slice(0, 5).map((student) => {
                  const unpaidAmount = student.fees?.reduce((sum: number, fee: { status: string; amount: number | string }) => {
                    if (fee.status !== 'paid') return sum + Number(fee.amount);
                    return sum;
                  }, 0) || 0;
                  
                  const hasOverdue = student.fees?.some((fee: { status: string; due_date: string }) => 
                    fee.status === 'overdue' || (new Date(fee.due_date) < new Date() && fee.status !== 'paid')
                  );
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{student.full_name}</p>
                        <p className="text-xs text-muted-foreground">{student.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${unpaidAmount.toLocaleString()}</p>
                        <Badge variant={hasOverdue ? 'destructive' : 'secondary'} className="text-xs">
                          {hasOverdue ? 'overdue' : 'pending'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Fee Payments</CardTitle>
          <div className="flex items-center text-sm text-[hsl(var(--success))]">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15% this month
          </div>
        </CardHeader>
        <CardContent>
          {paymentsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !recentPayments || recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent payments.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium text-sm">{payment.students?.full_name || 'Unknown'}</p>
                  <p className="text-2xl font-bold text-[hsl(var(--success))] mt-1">
                    ${Number(payment.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {payment.paid_date ? format(new Date(payment.paid_date), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
