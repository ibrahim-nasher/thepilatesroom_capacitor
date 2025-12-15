import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '@i18n';
import { useNotificationStore } from '@store';
import './BottomNavigation.scss';

// Use native iOS tab icons
const HomeIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <img 
    src={active ? '/icons/tabs/Group 56589.png' : '/icons/tabs/Group 56589.png'} 
    alt="Home"
    style={{ opacity: active ? 1 : 0.5, width: '24px', height: '24px' }}
  />
);

const ClassesIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <img 
    src={active ? '/icons/tabs/Group 56590.png' : '/icons/tabs/Group 56590.png'} 
    alt="Classes"
    style={{ opacity: active ? 1 : 0.5, width: '24px', height: '24px' }}
  />
);

const PackagesIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <img 
    src={active ? '/icons/tabs/Group 56591.png' : '/icons/tabs/Group 56591.png'} 
    alt="Packages"
    style={{ opacity: active ? 1 : 0.5, width: '24px', height: '24px' }}
  />
);

const ProfileIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <img 
    src={active ? '/icons/tabs/Group 56592.png' : '/icons/tabs/Group 56592.png'} 
    alt="Profile"
    style={{ opacity: active ? 1 : 0.5, width: '24px', height: '24px' }}
  />
);

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const unreadCount = useNotificationStore(state => state.unreadCount);

  const navItems = [
    { path: '/home', label: t('navigation.home'), Icon: HomeIcon },
    { path: '/classes', label: t('navigation.classes'), Icon: ClassesIcon },
    { path: '/packages', label: t('navigation.packages'), Icon: PackagesIcon },
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
