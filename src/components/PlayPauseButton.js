import React from 'react';
import PropTypes from 'prop-types';

function PlayPauseButton(props) {
  return (
    <button onClick={props.onToggle}>
      {props.isPlaying ? 'Stop' : 'Play'}
    </button>
  );
}

PlayPauseButton.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};

export default PlayPauseButton;
