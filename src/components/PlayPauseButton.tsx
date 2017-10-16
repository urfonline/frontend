import React from 'react';
import PlayIcon from './PlayIcon';

interface IProps {
  onChange(isPlaying: boolean): void;
  isPlaying: boolean;
  isLive: boolean;
}

function PlayPauseButton({ isPlaying, isLive, onChange }: IProps) {
  return (
    <button onClick={() => onChange(!isPlaying)}>
      {isPlaying ? isLive ? 'Stop' : 'Pause' : <PlayIcon tone="light" />}
    </button>
  );
}

export default PlayPauseButton;
