import React from 'react';
/* eslint-disable */

import playIcon from '../img/play-broadcasting.svg';
import pauseIcon from '../img/pause-broadcasting.svg';

interface IProps {
  tone: string;
}

const PlayIcon = ({ tone }: IProps) => (
  <img
    src={tone === 'pause' ? pauseIcon : playIcon}
    alt={tone === 'pause' ? 'Pause' : 'Play'}
  />
);
/* eslint-enable */

export default PlayIcon;
