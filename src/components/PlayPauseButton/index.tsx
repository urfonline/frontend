import React from 'react';
import PlayIcon from '../PlayIcon';

interface IProps {
  onChange(isPlaying: boolean): void;
  isPlaying: boolean;
  isLive: boolean;
}

function PlayPauseButton({ isPlaying, isLive, onChange }: IProps) {
  return (
    <button className="PlayPauseButton" onClick={() => onChange(!isPlaying)}>
      {isPlaying ? isLive ? 'Stop' : <PlayIcon tone="pause" /> : <PlayIcon tone="light" />}
    </button>
  );
}

export default PlayPauseButton;
