import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/documents': 'Documents',
  '/documents/hall-tickets': 'Hall Tickets',
  '/documents/results': 'Results',
  '/documents/roadmaps': 'AI Roadmaps',
  '/documents/upload': 'Upload',
  '/documents/my-uploads': 'My Uploads',
  '/documents/pending': 'Pending Documents',
  '/documents/approve': 'Approve Documents',
  '/tickets': 'Tickets',
  '/tickets/new': 'Create Ticket',
  '/tickets/support': 'Support Tickets',
  '/tickets/completed': 'Completed Tickets',
  '/chats/support-admin': 'Support Chat',
  '/chats/admin-super-admin': 'Admin Chat',
  '/activities': 'Activities',
  '/activities/stats': 'Activity Stats',
  '/profile': 'Profile',
  '/tech-news': 'Tech News',
  '/predictor': 'College Predictor',
  '/ai-career': 'AI Career',
  '/company/profile': 'Company Profile',
  '/admin/companies': 'Company Verification',
  '/admin/jobs': 'Job Postings',
  '/admin/jobs/new': 'New Job',
  '/student/notifications': 'Notifications',
  '/student/jobs': 'Job Listings',
};

function getBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ path: '/', label: 'Home' }];
  let acc = '';
  for (const seg of segments) {
    acc += `/${seg}`;
    const label = LABELS[acc] || seg.replace(/-/g, ' ');
    crumbs.push({ path: acc, label });
  }
  return crumbs;
}

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const crumbs = getBreadcrumbs(pathname);
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">{crumb.label}</span>
              ) : (
                <>
                  <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
                  <span className="breadcrumb-sep" aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
