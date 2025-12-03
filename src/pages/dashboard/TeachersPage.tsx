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
import { Search, Plus, Edit, Trash2, Mail, Phone, Loader2 } from 'lucide-react';
import { useTeachers, useDeleteTeacher } from '@/hooks/api';
import { toast } from 'sonner';

const TeachersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: teachers, isLoading, error } = useTeachers();
  const deleteTeacher = useDeleteTeacher();

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    return teachers.filter(teacher =>
      teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      await deleteTeacher.mutateAsync(id);
      toast.success('Teacher deleted successfully');
    } catch (error) {
      toast.error('Failed to delete teacher');
      console.error('Delete error:', error);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground">Manage teachers and staff members</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading teachers. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Manage teachers and staff members</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg">
              All Teachers ({isLoading ? '...' : filteredTeachers.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
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
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No teachers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.full_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{teacher.subject}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Mail className="h-3 w-3" />
                          {teacher.email || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Phone className="h-3 w-3" />
                          {teacher.phone || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {teacher.teacher_id}
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
                            onClick={() => handleDelete(teacher.id, teacher.full_name)}
                            disabled={deleteTeacher.isPending}
                          >
                            {deleteTeacher.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersPage;
