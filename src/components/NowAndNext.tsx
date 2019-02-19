import React, {useCallback} from 'react';
import BroadcastingIcon from '../components/BroadcastingIcon';
import { getOnAirSlot } from '../utils/schedule';
import { playLive } from '../ducks/player';
import { RootState } from '../types';
import {useDispatch, useMappedState} from "redux-react-hook";

interface IProps {}

const NowAndNext: React.FC<IProps> = () => {
  const mapState = useCallback((state: RootState) => ({
    player: state.player,
    schedule: state.schedule,
  }), []);
  const {player, schedule} = useMappedState(mapState);
  const dispatch = useDispatch();

  if (schedule.isLoading || player.stream !== null) {
    return null;
  }

  const slot = getOnAirSlot(schedule.data.slots);
  const show = schedule.data.shows[slot.show];

  return (
    <button className="NowAndNext" onClick={() => dispatch(playLive())}>
      <div className="NowAndNext__heading">
        <div className="NowAndNext__icon">
          <BroadcastingIcon animate />
        </div>
        Listen Live
      </div>
      <div className="NowAndNext__now">Now: {show.title}</div>
    </button>
  );
};

export default NowAndNext;
