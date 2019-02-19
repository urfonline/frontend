import React from 'react';
import { connect } from 'react-redux';
import PlayPauseButton from './PlayPauseButton';
import PlayerAudio from './PlayerAudio';
import { playerAudioStateChange, playerUserStateChange } from '../ducks/player';
import { Link } from 'react-router-dom';
import { formatTime } from '../utils/schedule';
import { RootState } from '../types';
import {AspectRatio, OneImage} from "./OneImage";
import {defaultShowCoverResource} from "../utils/shows";

interface IProps {
  isLoading: boolean;
  shows: any; // todo
  slot: any;
  player: any;
  schedule: any;
  playerUserStateChange: any;
  playerAudioStateChange: any;
}

const Player: React.FC<IProps> = (props: IProps) => {
  const { player, schedule } = props;

  if (schedule.isLoading) {
    return null;
  }

  const show = schedule.currentlyOnAir.show;

  return (
    <div className="Player">
      <div className="Player__container">
        <div className="Player__show-cover">
          <OneImage src={show.cover.resource ? show.cover.resource : defaultShowCoverResource} aspectRatio={AspectRatio.r1by1} alt="" />
        </div>
        <div className="Player__content">
          <div className="Player__button">
            <PlayPauseButton
              isPlaying={player.userState}
              isLive={player.audioSourceType === 'live'}
              onChange={(state) => props.playerUserStateChange(state)}
            />
          </div>
          <Link className="Player__show-name" to={`/shows/${show.slug}`}>
            {show.name}
          </Link>
          <small>
            {formatTime(schedule.currentlyOnAir.startDate)}-{formatTime(
              schedule.currentlyOnAir.endDate,
            )}
          </small>
        </div>
      </div>
      <PlayerAudio
        stream={player.stream}
        userState={player.userState}
        onChange={(state: any) => props.playerAudioStateChange(state)}
      />
    </div>
  );
};

Player.defaultProps = {
  isLoading: true,
  shows: null,
  slot: null,
};

export default connect(
  (state: RootState) => ({
    player: state.player,
    schedule: state.schedule,
  }),
  {
    playerUserStateChange,
    playerAudioStateChange,
  },
)(Player) as any;
