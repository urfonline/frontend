import React from 'react';

import PlayIcon from '../img/play.svg';
import PauseIcon from '../img/pause.svg';

interface IProps {
  tone: string;
}

const PlayPauseIcon = ({ tone }: IProps) => (
  <div>{tone === 'pause' ? <PauseIcon /> : <PlayIcon />}</div>
);
/* eslint-enable */

export default PlayPauseIcon;
