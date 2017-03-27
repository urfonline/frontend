import React from 'react';

function PlayPauseButton(props) {
  return (
    <button onClick={props.onToggle}>{props.isPlaying ? 'Stop' : 'Play'}</button>
  );
}

PlayPauseButton.propTypes = {
  onToggle: React.PropTypes.func.isRequired,
  isPlaying: React.PropTypes.bool.isRequired,
};

export default PlayPauseButton;
