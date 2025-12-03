import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StudentsPage from './StudentsPage';
import TeachersPage from './TeachersPage';
import FinancesPage from './FinancesPage';
import AnnouncementsPage from './AnnouncementsPage';
import { Loader2 } from 'lucide-react';

const AdminSubPages = () => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const path = location.pathname;

  const renderPage = () => {
    if (path.includes('/students')) return <StudentsPage />;
    if (path.includes('/teachers')) return <TeachersPage />;
    if (path.includes('/finances')) return <FinancesPage />;
    if (path.includes('/announcements')) return <AnnouncementsPage />;
    return null;
  };

  return (
    <DashboardLayout>
      {renderPage()}
    </DashboardLayout>
  );
};

export default AdminSubPages;
