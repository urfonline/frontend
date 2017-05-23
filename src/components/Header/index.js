import React from 'react';
import { Link } from 'react-router-dom';
import URFLogo from '../URFLogoHeader';

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
          <ul className="Header__menu">
            <li className="Header__menu-item">
              <Link to="/schedule">Schedule</Link>
            </li>
            <li className="Header__menu-item">
              <Link to="/shows">Shows</Link>
            </li>
            <li className="Header__menu-item">
              <Link to="/news-events">News & Events</Link>
            </li>
            <li className="Header__menu-item">
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
