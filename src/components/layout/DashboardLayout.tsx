import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GraduationCap, LayoutDashboard, Users, UserCog, DollarSign, Bell, Calendar, ClipboardCheck, BookOpen, FileText, User, BarChart3, Clock, LogOut, Menu, X } from 'lucide-react';
interface DashboardLayoutProps {
  children: ReactNode;
}
const DashboardLayout = ({
  children
}: DashboardLayoutProps) => {
  const {
    role,
    signOut,
    userName
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  const adminNav = [{
    icon: LayoutDashboard,
    label: 'Overview',
    path: '/dashboard'
  }, {
    icon: Users,
    label: 'Students',
    path: '/dashboard/students'
  }, {
    icon: UserCog,
    label: 'Teachers',
    path: '/dashboard/teachers'
  }, {
    icon: DollarSign,
    label: 'Finances',
    path: '/dashboard/finances'
  }, {
    icon: Bell,
    label: 'Announcements',
    path: '/dashboard/announcements'
  }];
  const teacherNav = [{
    icon: LayoutDashboard,
    label: 'Overview',
    path: '/dashboard'
  }, {
    icon: Calendar,
    label: 'My Schedule',
    path: '/dashboard/schedule'
  }, {
    icon: ClipboardCheck,
    label: 'Attendance',
    path: '/dashboard/attendance'
  }, {
    icon: BookOpen,
    label: 'Gradebook',
    path: '/dashboard/gradebook'
  }, {
    icon: FileText,
    label: 'Assignments',
    path: '/dashboard/assignments'
  }];
  const studentNav = [{
    icon: LayoutDashboard,
    label: 'Overview',
    path: '/dashboard'
  }, {
    icon: BarChart3,
    label: 'My Grades',
    path: '/dashboard/grades'
  }, {
    icon: Clock,
    label: 'Timetable',
    path: '/dashboard/timetable'
  }, {
    icon: Bell,
    label: 'Announcements',
    path: '/dashboard/announcements'
  }];
  const navigation = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;
  const roleLabel = role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Teacher' : 'Student';
  const roleColor = role === 'admin' ? 'bg-primary' : role === 'teacher' ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--warning))]';
  return <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn("fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300", sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sidebar-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-primary-foreground">EduManage</h1>
              <span className={cn("text-xs px-2 py-0.5 rounded-full text-primary-foreground", roleColor)}>
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map(item => {
          const isActive = location.pathname === item.path;
          return <button key={item.path} onClick={() => {
            navigate(item.path);
            setSidebarOpen(false);
          }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground")}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>;
        })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{roleLabel}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>;
};
export default DashboardLayout;