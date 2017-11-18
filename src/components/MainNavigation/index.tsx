import React from 'react';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';

interface IProps {
  desktop?: boolean;
  mobile?: boolean;
}

function MainNavigation({ desktop, mobile }: IProps) {
  return (
    <div
      className={cx('MainNavigation', {
        'MainNavigation--desktop': desktop,
        'MainNavigation--mobile': mobile,
      })}
    >
      <ul className="MainNavigation__list">
        <li className="MainNavigation__item">
          <NavLink to="/schedule">Schedule</NavLink>
        </li>
        <li className="MainNavigation__item">
          <NavLink to="/shows">Shows</NavLink>
        </li>
        <li className="MainNavigation__item">
          <NavLink to="/news-events">News {'&'} Events</NavLink>
        </li>
        <li className="MainNavigation__item">
          <NavLink to="/we-are-urf">About</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default MainNavigation;
