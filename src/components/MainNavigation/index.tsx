import React from 'react';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';
import { RootState } from '../../types';

interface IProps {
  desktop?: boolean;
  mobile?: boolean;
}

function MainNavigation({ desktop, mobile }: IProps) {
  let { stream } = useMappedState((state: RootState) => ({ stream: state.streams.stream }));

  return (
    <div
      className={cx('MainNavigation', {
        'MainNavigation--desktop': desktop,
        'MainNavigation--mobile': mobile,
      })}
    >
      <ul className="MainNavigation__list">
        {stream && stream.slate && <li className="MainNavigation__item">
          <NavLink to="/schedule">Schedule</NavLink>
        </li>}
        <li className="MainNavigation__item">
          <NavLink to="/shows">Shows</NavLink>
        </li>
        <li className="MainNavigation__item">
          <NavLink to="/news-events">News {'&'} Events</NavLink>
        </li>
        <li className="MainNavigation__item">
          <NavLink to="/we-are-urf">About</NavLink>
        </li>
        <li className="MainNavigation__item">
          <NavLink to="/elections">Elections</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default MainNavigation;
