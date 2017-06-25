import React from 'react';
import { Link } from 'react-router-dom';
import URFLogo from '../URFLogoHeader';
import MainNavigation from '../MainNavigation';

function Header() {
  return (
    <header className="Header">
      <div className="Container">
        <div className="Header__container">
          <h1 className="Header__logo">
            <Link to="/">
              <URFLogo />
            </Link>
          </h1>
          <div className="Header__menu">
            <MainNavigation desktop />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
