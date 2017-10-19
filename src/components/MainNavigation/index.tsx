import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

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
          <Link to="/schedule">Schedule</Link>
        </li>
        <li className="MainNavigation__item">
          <Link to="/shows">Shows</Link>
        </li>
        <li className="MainNavigation__item">
          <Link to="/news-events">News {'&'} Events</Link>
        </li>
        <li className="MainNavigation__item">
          <Link to="/we-are-urf">About</Link>
        </li>
      </ul>
    </div>
  );
}

export default MainNavigation;
