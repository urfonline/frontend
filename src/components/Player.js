import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Image from './Image';
import PlayPauseButton from './PlayPauseButton';
import PlayerAudio from './PlayerAudio';
import { playerUserStateChange, playerAudioStateChange } from '../actions';

function Player({ player, schedule, dispatch }) {
  let content;
  if (schedule.isLoading) {
    return null;
  } else {
    content = schedule.currentlyOnAir.show.name;
  }

  const show = schedule.currentlyOnAir.show;

  return (
    <div className="Player">
      <div className="Container">
        <div className="Player__container">
          <PlayPauseButton
            isPlaying={player.userState}
            isLive={player.audioSourceType === 'live'}
            onChange={state => dispatch(playerUserStateChange(state))}
          />
          <div className="Player__show-cover">
            <Image src={show.cover.resource} />
          </div>
          <span className="Player__show-name">{show.name}</span>
        </div>
      </div>
      <PlayerAudio
        stream={player.stream}
        userState={player.userState}
        onChange={state => dispatch(playerStateChange(state))}
      />
    </div>
  );
}

Player.propTypes = {
  isLoading: PropTypes.bool,
  shows: PropTypes.object,
  slot: PropTypes.object,
  player: PropTypes.object,
};

Player.defaultProps = {
  isLoading: true,
  shows: null,
  slot: null,
};

export default connect(state => ({
  schedule: state.schedule,
  player: state.player,
}))(Player);
