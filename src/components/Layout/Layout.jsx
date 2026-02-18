import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import Footer from '../Footer/Footer';
import './Layout.css';

const MOBILE_BREAKPOINT = 1024;

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keep sidebar closed when entering mobile view (e.g. resize or initial load on small screen)
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = (e) => {
      if (e.matches) setSidebarOpen(false);
    };
    if (media.matches) setSidebarOpen(false);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="app-layout">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content animate-main-in">
        <Breadcrumb />
        {children}
      </main>
      <Footer variant="app" />
    </div>
  );
}
