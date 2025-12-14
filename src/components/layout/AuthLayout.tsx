import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__header safe-area-top">
        <h1 className="auth-layout__logo">The Pilates Room</h1>
      </div>
      <div className="auth-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
