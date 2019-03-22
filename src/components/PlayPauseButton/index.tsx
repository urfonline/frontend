import React from 'react';
import PlayIcon, {PlayerIcons} from '../PlayIcon';

interface IProps {
  onChange(isPlaying: boolean): void;
  isPlaying: boolean;
  isLive: boolean;
  state: any; // todo
}

function PlayPauseButton({ isPlaying, onChange, state }: IProps) {
  let tone = PlayerIcons.Play;

  if (isPlaying && state === 'playing') {
    tone = PlayerIcons.Pause;
  }


  if (isPlaying && state === 'waiting') {
    tone = PlayerIcons.Loading;
  }

  return (
    <button className="PlayPauseButton" onClick={() => onChange(!isPlaying)}>
      <PlayIcon tone={tone} />
    </button>
  );
}

export default PlayPauseButton;
