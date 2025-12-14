import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  // Hide bottom navigation on certain pages (e.g., detail pages, edit pages)
  const hideBottomNav = [
    '/profile/edit',
    '/classes/',
    '/packages/',
    '/bookings/',
  ].some(path => location.pathname.startsWith(path) && location.pathname.includes('/'));

  return (
    <div className="main-layout">
      <main className="main-layout__content">
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
