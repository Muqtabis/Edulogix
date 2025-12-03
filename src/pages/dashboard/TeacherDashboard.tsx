import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen,
  Check,
  X,
  AlertCircle,
  Plus,
  Loader2,
} from 'lucide-react';
import { useTeachers, useClasses, useStudents, useAssignments } from '@/hooks/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type AttendanceStatus = 'present' | 'absent' | 'late';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();

  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  // Find current teacher
  const currentTeacher = useMemo(() => {
    if (!teachers || !user) return null;
    return teachers.find(t => t.user_id === user.id);
  }, [teachers, user]);

  // Get teacher's classes
  const teacherClasses = useMemo(() => {
    if (!classes || !currentTeacher) return [];
    return classes.filter(c => c.teacher_id === currentTeacher.id);
  }, [classes, currentTeacher]);

  // Get class options for dropdowns
  const classOptions = useMemo(() => {
    return teacherClasses.map(c => c.name);
  }, [teacherClasses]);

  // Mock today's schedule
  const todaySchedule = useMemo(() => {
    if (!teacherClasses) return [];
    return teacherClasses.slice(0, 4).map((cls, i) => ({
      id: cls.id,
      subject: cls.subject,
      class: cls.name,
      time: ['08:00 - 09:00', '09:15 - 10:15', '11:00 - 12:00', '14:00 - 15:00'][i] || '08:00 - 09:00',
      room: cls.room || 'Room 101',
    }));
  }, [teacherClasses]);

  // Get students for selected class (simplified - would need class enrollment table)
  const classStudents = useMemo(() => {
    if (!students || !selectedClass) return [];
    return students.filter(s => s.class === selectedClass).slice(0, 10);
  }, [students, selectedClass]);

  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const getStatusButton = (studentId: string, status: AttendanceStatus) => {
    const isActive = attendance[studentId] === status;
    const baseClass = "px-3 py-1 text-xs font-medium rounded-full transition-all";
    
    const styles = {
      present: isActive ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : "bg-muted text-muted-foreground hover:bg-[hsl(var(--success))]/20",
      absent: isActive ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:bg-destructive/20",
      late: isActive ? "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]" : "bg-muted text-muted-foreground hover:bg-[hsl(var(--warning))]/20",
    };

    return (
      <button
        onClick={() => updateAttendance(studentId, status)}
        className={cn(baseClass, styles[status])}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    );
  };

  const handleSubmitAttendance = () => {
    // Would implement actual attendance submission here
    toast.success('Attendance submitted successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your classes and track student progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Today's Classes" 
          value={todaySchedule.length} 
          icon={Calendar} 
        />
        <StatsCard 
          title="Total Students" 
          value={studentsLoading ? '...' : students?.length || 0} 
          icon={Users} 
          variant="success" 
        />
        <StatsCard 
          title="Assignments" 
          value={assignmentsLoading ? '...' : assignments?.length || 0} 
          icon={BookOpen} 
          variant="warning" 
        />
        <StatsCard 
          title="My Classes" 
          value={teacherClasses.length} 
          icon={Clock} 
        />
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="gradebook">Gradebook</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {todaySchedule.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No classes scheduled for today.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {todaySchedule.map((schedule) => (
                      <div key={schedule.id} className="relative pl-10">
                        <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="font-semibold">{schedule.subject}</p>
                                <p className="text-sm text-muted-foreground">Class {schedule.class}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{schedule.time}</Badge>
                                <p className="text-xs text-muted-foreground mt-1">{schedule.room}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle className="text-lg">Mark Attendance</CardTitle>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : classStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {selectedClass ? 'No students in this class.' : 'Please select a class.'}
                </p>
              ) : (
                <>
                  <div className="space-y-3">
                    {classStudents.map((student) => (
                      <div 
                        key={student.id} 
                        className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {student.full_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.full_name}</p>
                            <p className="text-xs text-muted-foreground">{student.student_id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {getStatusButton(student.id, 'present')}
                          {getStatusButton(student.id, 'late')}
                          {getStatusButton(student.id, 'absent')}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" onClick={handleSubmitAttendance}>
                    <Check className="h-4 w-4 mr-2" />
                    Submit Attendance
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gradebook Tab */}
        <TabsContent value="gradebook">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle className="text-lg">Gradebook</CardTitle>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Quiz 1</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Quiz 2</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Midterm</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.slice(0, 5).map((student) => (
                      <tr key={student.id} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">{student.full_name}</td>
                        <td className="py-3 px-4">
                          <Input type="number" className="w-16 text-center mx-auto" defaultValue={85} />
                        </td>
                        <td className="py-3 px-4">
                          <Input type="number" className="w-16 text-center mx-auto" defaultValue={90} />
                        </td>
                        <td className="py-3 px-4">
                          <Input type="number" className="w-16 text-center mx-auto" defaultValue={88} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary">87.7%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="w-full mt-4">Save Grades</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Assignment title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classOptions.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the assignment..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
