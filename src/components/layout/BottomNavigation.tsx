import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '@i18n';
import { useNotificationStore } from '@store';
import './BottomNavigation.scss';

// Icon components (placeholder - replace with actual icons)
const HomeIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClassesIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor">
    <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PackagesIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BookingsIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ProfileIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const unreadCount = useNotificationStore(state => state.unreadCount);

  const navItems = [
    { path: '/home', label: t('navigation.home'), Icon: HomeIcon },
    { path: '/classes', label: t('navigation.classes'), Icon: ClassesIcon },
    { path: '/packages', label: t('navigation.packages'), Icon: PackagesIcon },
    { path: '/bookings', label: t('navigation.bookings'), Icon: BookingsIcon },
    { path: '/profile', label: t('navigation.profile'), Icon: ProfileIcon },
  ];

  return (
    <nav className="bottom-navigation safe-area-bottom">
      {navItems.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `bottom-navigation__item ${isActive ? 'bottom-navigation__item--active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="bottom-navigation__icon">
                <Icon active={isActive} />
                {path === '/profile' && unreadCount > 0 && (
                  <span className="bottom-navigation__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </div>
              <span className="bottom-navigation__label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
