import React, { useCallback } from 'react';
import PlayPauseButton from './PlayPauseButton';
import {PlayerAudio} from './PlayerAudio';
import { playerAudioStateChange, playerUserStateChange } from '../ducks/player';
import { Link } from 'react-router-dom';
import { formatTime } from '../utils/schedule';
import { isMobile } from '../utils/mobile';
import { RootState } from '../types';
import { AspectRatio, OneImage } from './OneImage';
import { defaultShowCoverResource } from '../utils/shows';
import { useDispatch, useMappedState } from 'redux-react-hook';
import StreamSwitcher from './StreamSwitcher';

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

  if (schedule.isLoading || !schedule.stream || !schedule.onAirSlot) {
    return null;
  }

  const {show, startDate, endDate} = schedule.onAirSlot;
  const stream = schedule.stream;

  let mountpoint = stream.mountpoint;
  if (isMobile) {
    mountpoint = stream.mobileMountpoint;
  }

  // this feels a little janky but hey ho
  let endpointUrl = null;
  let queryParts = [];
  if (stream.proxyUrl) {
    endpointUrl = `${stream.proxyUrl}`;
    queryParts.push(`mp=${mountpoint}`);
  } else {
    endpointUrl = `http://${stream.host}:${stream.port}${mountpoint}`;
  }

  const endpoint = player.userState
    ? endpointUrl
    : null;

  return (
    <div className="Player">
      <div className="Player__img-container">
        {show.cover.resource ? <img className="Player__img-back" src={'https://urf.imgix.net/' + show.cover.resource + "?w=200&h=200&q=50&auto=format"} /> : null}
      </div>
      <div className="Player__container">
        <div className="Player__content Player__section">
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
          <div className="Player__show-details">
            <Link className="Player__show-name" to={`/shows/${show.slug}`}>
              {show.name}
            </Link>
            <small>
              {formatTime(startDate)}-
              {formatTime(endDate)}
            </small>
          </div>
        </div>
        <div className="Player__controls Player__section">
          <div className="Player__button">
            <PlayPauseButton
              isPlaying={player.userState}
              state={player.playerState}
              isLive={player.audioSourceType === 'live'}
              onChange={(state) => dispatch(playerUserStateChange(state))}
            />
          </div>
        </div>
        <StreamSwitcher />
      </div>

      {endpoint ? <PlayerAudio
        stream={endpoint}
        query={queryParts}
        userState={player.userState}
        onChange={(state: any) => dispatch(playerAudioStateChange(state))}
      /> : null}
    </div>
  );
};

Player.defaultProps = {
  shows: null,
  slot: null,
};

export default Player;
