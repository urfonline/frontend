import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BroadcastingIcon from '../components/BroadcastingIcon';
import { getOnAirSlot } from '../utils/schedule';
import { playLive } from '../actions';

function NowAndNext({ schedule, player, playLiveAction }) {
  if (schedule.isLoading || player.stream !== null) {
    return null;
  }

  const slot = getOnAirSlot(schedule.data.slots);
  const show = schedule.data.shows[slot.show];

  return (
    <button className="NowAndNext" onClick={playLiveAction} href="">
      <div className="NowAndNext__heading">
        <div className="NowAndNext__icon">
          <BroadcastingIcon animate />
        </div>
        Listen Live
      </div>
      <div className="NowAndNext__now">Now: {show.title}</div>
    </button>
  );
}

NowAndNext.propTypes = {
  schedule: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playLiveAction: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    schedule: state.schedule,
    player: state.player,
  }),
  dispatch =>
    bindActionCreators(
      {
        playLiveAction: playLive,
      },
      dispatch
    )
)(NowAndNext);
