import React from 'react';
import PropTypes from 'prop-types';
import PlayIcon from './PlayIcon';

function PlayPauseButton({ isPlaying, isLive, onChange }) {
  return (
    <button onClick={() => onChange(!isPlaying)}>
      {isPlaying ? isLive ? 'Stop' : 'Pause' : <PlayIcon tone="light" />}
    </button>
  );
}

PlayPauseButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isLive: PropTypes.bool.isRequired,
};

export default PlayPauseButton;
