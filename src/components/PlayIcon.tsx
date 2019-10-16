import React from 'react';

import PlayIcon from '../img/play.svg';
import PauseIcon from '../img/pause.svg';
import LoadingIcon from '../img/loading.svg';

export enum PlayerIcons {
  Play,
  Loading,
  Pause,
}

interface IProps {
  tone: PlayerIcons;
}

const PlayPauseIcon = ({ tone }: IProps) => {
  if (tone === PlayerIcons.Play) return <PlayIcon style={{ position: 'relative', left: '2.8px' }} />;
  if (tone === PlayerIcons.Pause) return <PauseIcon />;
  if (tone === PlayerIcons.Loading) return <LoadingIcon />;

  return null;
};
/* eslint-enable */

export default PlayPauseIcon;
