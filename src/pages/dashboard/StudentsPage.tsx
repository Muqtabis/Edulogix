import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudents, useDeleteStudent } from '@/hooks/api';
import { toast } from 'sonner';

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: students, isLoading, error } = useStudents();
  const deleteStudent = useDeleteStudent();

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(student =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      await deleteStudent.mutateAsync(id);
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
      console.error('Delete error:', error);
    }
  };

  const getFeeStatus = (student: { fees?: Array<{ status: string; due_date: string }> }) => {
    if (!student.fees || student.fees.length === 0) return 'paid';
    
    const unpaidFees = student.fees.filter((fee) => fee.status !== 'paid');
    if (unpaidFees.length === 0) return 'paid';
    
    const hasOverdue = unpaidFees.some((fee) => {
      return new Date(fee.due_date) < new Date() && fee.status !== 'paid';
    });
    
    return hasOverdue ? 'overdue' : 'pending';
  };

  const getFeeStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30',
      pending: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30',
      overdue: 'bg-destructive/10 text-destructive border-destructive/30',
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Directory</h1>
            <p className="text-muted-foreground">Manage and view all student records</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading students. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Directory</h1>
          <p className="text-muted-foreground">Manage and view all student records</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg">
              All Students ({isLoading ? '...' : filteredStudents.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Parent Contact</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const feeStatus = getFeeStatus(student);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.full_name}</TableCell>
                        <TableCell className="text-muted-foreground">{student.student_id}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="text-muted-foreground">{student.parent_contact || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("capitalize", getFeeStatusBadge(feeStatus))}>
                            {feeStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(student.id, student.full_name)}
                              disabled={deleteStudent.isPending}
                            >
                              {deleteStudent.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
