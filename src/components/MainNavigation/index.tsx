import React from 'react';
import cx from 'classnames';
import { css } from 'emotion';
import { NavLink } from 'react-router-dom';
import { useMappedState } from 'redux-react-hook';
import { RootState } from '../../types';

import ExternalLinkIcon from '../../img/external-link.svg';

interface IProps {
  desktop?: boolean;
  mobile?: boolean;
}

const ExternalLinkStyle = css`
  margin: 0 7px;
`;

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
        <hr className="MainNavigation__break"/>
        <li className="MainNavigation__item">
          <a href="https://76podcasting.net">
            76 Podcasts
            <ExternalLinkIcon className={ExternalLinkStyle}/>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default MainNavigation;
