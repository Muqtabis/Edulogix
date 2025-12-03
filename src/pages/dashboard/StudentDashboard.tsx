import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  User, 
  Award, 
  Clock, 
  DollarSign,
  BookOpen,
  Bell,
  Loader2,
} from 'lucide-react';
import { useStudents, useAnnouncements, useStudentGrades } from '@/hooks/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();

  // Find the current student based on the logged-in user
  const currentStudent = useMemo(() => {
    if (!students || !user) return null;
    return students.find(s => s.user_id === user.id);
  }, [students, user]);

  const { data: grades, isLoading: gradesLoading } = useStudentGrades(currentStudent?.id || '');

  // Calculate GPA from grades
  const gpa = useMemo(() => {
    if (!grades || grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => {
      const percentage = (Number(grade.score) / Number(grade.max_score || 100)) * 100;
      return sum + percentage;
    }, 0);
    return (total / grades.length / 25).toFixed(1); // Convert percentage to 4.0 scale
  }, [grades]);

  // Calculate attendance (placeholder - would need actual attendance data)
  const attendance = 95; // Default value

  // Get fee status
  const feeStatus = useMemo(() => {
    if (!currentStudent?.fees || currentStudent.fees.length === 0) return 'paid';
    const unpaidFees = currentStudent.fees.filter((fee: any) => fee.status !== 'paid');
    if (unpaidFees.length === 0) return 'paid';
    const hasOverdue = unpaidFees.some((fee: any) => 
      new Date(fee.due_date) < new Date() && fee.status !== 'paid'
    );
    return hasOverdue ? 'overdue' : 'pending';
  }, [currentStudent]);

  const periods = ['8:00-9:00', '9:15-10:15', '10:30-11:30', 'Break', '12:30-1:30', '2:00-3:00'];

  // Mock weekly timetable (would need to be stored in database)
  const weeklyTimetable = [
    { day: 'Monday', periods: ['Mathematics', 'Physics', 'English', 'Break', 'Chemistry', 'Biology'] },
    { day: 'Tuesday', periods: ['English', 'Mathematics', 'Physics', 'Break', 'Biology', 'Chemistry'] },
    { day: 'Wednesday', periods: ['Physics', 'Chemistry', 'Mathematics', 'Break', 'English', 'P.E.'] },
    { day: 'Thursday', periods: ['Biology', 'English', 'Chemistry', 'Break', 'Mathematics', 'Physics'] },
    { day: 'Friday', periods: ['Chemistry', 'Biology', 'English', 'Break', 'Physics', 'Mathematics'] },
  ];

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Student profile not found. Please contact your administrator.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentStudent.full_name}</h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                  Class {currentStudent.class}
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                  ID: {currentStudent.student_id}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          title="Overall GPA" 
          value={gradesLoading ? '...' : gpa} 
          icon={Award} 
        />
        <StatsCard 
          title="Attendance" 
          value={`${attendance}%`} 
          icon={Clock} 
          variant="success"
        />
        <Card className={cn(
          "border-2",
          feeStatus === 'paid' 
            ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5" 
            : "border-destructive/30 bg-destructive/5"
        )}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Fee Status</p>
                <p className="text-3xl font-bold text-foreground mt-1 capitalize">{feeStatus}</p>
              </div>
              <div className={cn(
                "p-3 rounded-xl",
                feeStatus === 'paid' 
                  ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" 
                  : "bg-destructive/10 text-destructive"
              )}>
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gradesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !grades || grades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No grades yet.</p>
            ) : (
              grades.slice(0, 5).map((grade) => (
                <div key={grade.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{grade.subject}</span>
                    <span className="text-sm font-bold">
                      {Number(grade.score)}/{Number(grade.max_score || 100)}
                    </span>
                  </div>
                  <Progress 
                    value={(Number(grade.score) / Number(grade.max_score || 100)) * 100} 
                    className="h-2"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Announcements
            </CardTitle>
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
                <div key={announcement.id} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{announcement.title}</h4>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {format(new Date(announcement.created_at), 'MMM dd')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{announcement.content}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timetable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Day</th>
                  {periods.map((period, i) => (
                    <th key={i} className="text-center py-3 px-2 font-medium text-muted-foreground text-xs">
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeklyTimetable.map((day) => (
                  <tr key={day.day} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium">{day.day}</td>
                    {day.periods.map((subject, i) => (
                      <td key={i} className="py-3 px-2 text-center">
                        {subject === 'Break' ? (
                          <Badge variant="secondary" className="text-xs">Break</Badge>
                        ) : (
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            {subject}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
