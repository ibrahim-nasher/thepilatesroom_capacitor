import React from 'react';
import './SplashScreen.scss';

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      <div className="splash-screen__content">
        <img 
          src="/splash.png" 
          alt="The Pilates Room" 
          className="splash-screen__logo"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
