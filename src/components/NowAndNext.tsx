import React from 'react';
import { connect } from 'react-redux';
import BroadcastingIcon from '../components/BroadcastingIcon';
import { getOnAirSlot } from '../utils/schedule';
import { playLive } from '../ducks/player';
import { RootState } from '../types';

interface IProps {
  schedule: any; // todo
  player: any;
  playLive: any;
}

function NowAndNext(props: IProps) {
  const { schedule, player } = props;

  if (schedule.isLoading || player.stream !== null) {
    return null;
  }

  const slot = getOnAirSlot(schedule.data.slots);
  const show = schedule.data.shows[slot.show];

  return (
    <button className="NowAndNext" onClick={props.playLive}>
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

export default connect(
  (state: RootState) => ({
    schedule: state.schedule,
    player: state.player,
  }),
  {
    playLive,
  },
)(NowAndNext);
