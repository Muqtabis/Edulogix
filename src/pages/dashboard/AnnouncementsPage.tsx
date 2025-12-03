import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Megaphone, Loader2 } from 'lucide-react';
import { useAnnouncements, useAddAnnouncement } from '@/hooks/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const AnnouncementsPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: announcements, isLoading } = useAnnouncements();
  const addAnnouncement = useAddAnnouncement();
  const { user } = useAuth();

  const handlePost = async () => {
    if (!title || !content) {
      toast.error('Please fill in both title and content.');
      return;
    }

    try {
      await addAnnouncement.mutateAsync({
        title,
        content,
        author_id: user?.id,
        target_audience: ['admin', 'teacher', 'student'],
      });

      setTitle('');
      setContent('');
      toast.success('Announcement posted successfully!');
    } catch (error) {
      toast.error('Failed to post announcement');
      console.error('Post error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notice Board</h1>
        <p className="text-muted-foreground">Post announcements for students and teachers</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Post Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Post Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                placeholder="Announcement title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea 
                placeholder="Write your announcement..." 
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handlePost}
              disabled={addAnnouncement.isPending}
            >
              {addAnnouncement.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Post Announcement
            </Button>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">All Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !announcements || announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No announcements yet.</p>
            ) : (
              announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold">{announcement.title}</h3>
                    </div>
                    <Badge variant="secondary">
                      {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm ml-11">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground mt-2 ml-11">
                    Posted by {announcement.profiles?.full_name || 'Admin'}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
