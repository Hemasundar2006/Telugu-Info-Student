import { useAuth } from '../../context/AuthContext';
import UserDashboard from './UserDashboard';
import SupportDashboard from './SupportDashboard';
import AdminDashboard from './AdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import CompanyDashboard from './CompanyDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || 'USER';

  if (role === 'SUPER_ADMIN') return <SuperAdminDashboard />;
  if (role === 'SUPPORT') return <SupportDashboard />;
  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'COMPANY') return <CompanyDashboard />;
  return <UserDashboard />;
}
