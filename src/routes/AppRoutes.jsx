import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout/Layout';

import PublicLayout from '../components/PublicLayout/PublicLayout';
import Landing from '../pages/Landing';
import About from '../pages/About';
import Pricing from '../pages/Pricing';
import Services from '../pages/Services';
import Contact from '../pages/Contact';
import TechNews from '../pages/TechNews';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import DocumentList from '../pages/Documents/DocumentList';
import HallTickets from '../pages/Documents/HallTickets';
import Results from '../pages/Documents/Results';
import Roadmaps from '../pages/Documents/Roadmaps';
import UploadDocument from '../pages/Documents/UploadDocument';
import PendingDocuments from '../pages/Documents/PendingDocuments';
import MyUploads from '../pages/Documents/MyUploads';
import CreateTicket from '../pages/Tickets/CreateTicket';
import MyTickets from '../pages/Tickets/MyTickets';
import SupportTickets from '../pages/Tickets/SupportTickets';
import CompletedTickets from '../pages/Tickets/CompletedTickets';
import TicketChat from '../pages/Tickets/TicketChat';
import SupportAdminChat from '../pages/Chats/SupportAdminChat';
import AdminSuperAdminChat from '../pages/Chats/AdminSuperAdminChat';
import ActivityDashboard from '../pages/Activities/ActivityDashboard';
import ActivityStats from '../pages/Activities/ActivityStats';
import UserActivities from '../pages/Activities/UserActivities';
import CollegePredictor from '../pages/Predictor/CollegePredictor';
import AiCareer from '../pages/AICareer/AiCareer';
import Profile from '../pages/Profile';
import Unauthorized from '../pages/Unauthorized';
import ForgotPassword from '../pages/ForgotPassword';
import CompanyRegister from '../pages/Company/CompanyRegister';
import CompanyLogin from '../pages/Company/CompanyLogin';
import CompanyProfile from '../pages/Company/CompanyProfile';
import CompanyVerification from '../pages/Company/CompanyVerification';

import { useAuth } from '../context/AuthContext';

function AuthRedirect({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner" /><p>Loading...</p></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function HomeOrRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner" /><p>Loading...</p></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <PublicLayout>
      <Landing />
    </PublicLayout>
  );
}

function TechNewsRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner" /><p>Loading...</p></div>;
  if (isAuthenticated) {
    return (
      <ProtectedRoute>
        <Layout><TechNews /></Layout>
      </ProtectedRoute>
    );
  }
  return (
    <PublicLayout>
      <TechNews />
    </PublicLayout>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeOrRedirect />} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/tech-news" element={<TechNewsRoute />} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login" element={<AuthRedirect><PublicLayout><Login /></PublicLayout></AuthRedirect>} />
        <Route path="/register" element={<AuthRedirect><PublicLayout><Register /></PublicLayout></AuthRedirect>} />
        <Route
          path="/company/login"
          element={
            <AuthRedirect>
              <PublicLayout>
                <CompanyLogin />
              </PublicLayout>
            </AuthRedirect>
          }
        />
        <Route
          path="/company/register"
          element={
            <AuthRedirect>
              <PublicLayout>
                <CompanyRegister />
              </PublicLayout>
            </AuthRedirect>
          }
        />
        <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
        <Route path="/unauthorized" element={<PublicLayout><Unauthorized /></PublicLayout>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/profile"
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <Layout><CompanyProfile /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <Layout><CompanyVerification /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/documents" element={<ProtectedRoute><Layout><DocumentList /></Layout></ProtectedRoute>} />
        <Route path="/documents/hall-tickets" element={<ProtectedRoute><Layout><HallTickets /></Layout></ProtectedRoute>} />
        <Route path="/documents/results" element={<ProtectedRoute><Layout><Results /></Layout></ProtectedRoute>} />
        <Route path="/documents/roadmaps" element={<ProtectedRoute><Layout><Roadmaps /></Layout></ProtectedRoute>} />
        <Route path="/documents/upload" element={<ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN', 'SUPER_ADMIN']}><Layout><UploadDocument /></Layout></ProtectedRoute>} />
        <Route path="/documents/my-uploads" element={<ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN', 'SUPER_ADMIN']}><Layout><MyUploads /></Layout></ProtectedRoute>} />
        <Route path="/documents/pending" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Layout><PendingDocuments /></Layout></ProtectedRoute>} />
        <Route path="/documents/approve" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Layout><PendingDocuments /></Layout></ProtectedRoute>} />

        <Route path="/tickets/new" element={<ProtectedRoute allowedRoles={['USER']}><Layout><CreateTicket /></Layout></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute allowedRoles={['USER']}><Layout><MyTickets /></Layout></ProtectedRoute>} />
        <Route path="/tickets/support" element={<ProtectedRoute allowedRoles={['SUPPORT']}><Layout><SupportTickets /></Layout></ProtectedRoute>} />
        <Route path="/tickets/completed" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Layout><CompletedTickets /></Layout></ProtectedRoute>} />
        <Route
          path="/tickets/:ticketId/chat"
          element={
            <ProtectedRoute allowedRoles={['USER', 'SUPPORT', 'ADMIN', 'SUPER_ADMIN']}>
              <Layout><TicketChat /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats/support-admin"
          element={
            <ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN', 'SUPER_ADMIN']}>
              <Layout><SupportAdminChat /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/admin-super-admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <Layout><AdminSuperAdminChat /></Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/activities" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Layout><ActivityDashboard /></Layout></ProtectedRoute>} />
        <Route path="/activities/stats" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Layout><ActivityStats /></Layout></ProtectedRoute>} />
        <Route path="/activities/user/:userId" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Layout><UserActivities /></Layout></ProtectedRoute>} />

        <Route path="/predictor" element={<ProtectedRoute><Layout><CollegePredictor /></Layout></ProtectedRoute>} />
        <Route path="/ai-career" element={<ProtectedRoute><Layout><AiCareer /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
