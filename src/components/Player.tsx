import React, { useCallback } from 'react';
import PlayPauseButton from './PlayPauseButton';
import PlayerAudio from './PlayerAudio';
import { playerAudioStateChange, playerUserStateChange } from '../ducks/player';
import { Link } from 'react-router-dom';
import { formatTime } from '../utils/schedule';
import { RootState } from '../types';
import { AspectRatio, OneImage } from './OneImage';
import { defaultShowCoverResource } from '../utils/shows';
import { useDispatch, useMappedState } from 'redux-react-hook';

interface IProps {}

const Player: React.FC<IProps> = () => {
  const mapState = useCallback(
    (state: RootState) => ({
      player: state.player,
      schedule: state.schedule,
    }),
    [],
  );
  const { player, schedule } = useMappedState(mapState);
  const dispatch = useDispatch();

  if (schedule.isLoading) {
    return null;
  }

  const show = schedule.currentlyOnAir.show;

  return (
    <div className="Player">
      <div className="Player__container">
        <div className="Player__show-cover">
          <OneImage
            src={
              show.cover.resource
                ? show.cover.resource
                : defaultShowCoverResource
            }
            aspectRatio={AspectRatio.r1by1}
            alt=""
          />
        </div>
        <div className="Player__content">
          <div className="Player__button">
            <PlayPauseButton
              isPlaying={player.userState}
              isLive={player.audioSourceType === 'live'}
              onChange={(state) => dispatch(playerUserStateChange(state))}
            />
          </div>
          <Link className="Player__show-name" to={`/shows/${show.slug}`}>
            {show.name}
          </Link>
          <small>
            {formatTime(schedule.currentlyOnAir.startDate)}-
            {formatTime(schedule.currentlyOnAir.endDate)}
          </small>
        </div>
      </div>
      <PlayerAudio
        stream={player.stream}
        userState={player.userState}
        onChange={(state: any) => dispatch(playerAudioStateChange(state))}
      />
    </div>
  );
};

Player.defaultProps = {
  shows: null,
  slot: null,
};

export default Player;
