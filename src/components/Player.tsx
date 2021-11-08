import React, { useCallback, useEffect } from 'react';
import PlayPauseButton from './PlayPauseButton';
import {PlayerAudio} from './PlayerAudio';
import { playerAudioStateChange, playerUserStateChange } from '../ducks/player';
import { Link } from 'react-router-dom';
import { formatTime } from '../utils/schedule';
import { RootState } from '../types';
import { AspectRatio, generateMediaImages, OneImage } from './OneImage';
import { defaultShowCoverResource } from '../utils/shows';
import { useDispatch, useMappedState } from 'redux-react-hook';
import StreamSwitcher from './StreamSwitcher';

interface IProps {}

const Player: React.FC<IProps> = () => {
  const mapState = useCallback(
    (state: RootState) => ({
      player: state.player,
      schedule: state.schedule,
      streams: state.streams,
    }),
    [],
  );
  const { player, schedule, streams } = useMappedState(mapState);
  const dispatch = useDispatch();

  useEffect(() => {
    if ('mediaSession' in navigator) {
      const session = navigator.mediaSession;

      session.setActionHandler("play", () => dispatch(playerUserStateChange(true)));
      session.setActionHandler("pause", () => dispatch(playerUserStateChange(false)));
      session.setActionHandler("stop", () => dispatch(playerUserStateChange(false)));
    }
  }, []);

  useEffect(() => {
    if ('mediaSession' in navigator && !!schedule.onAirSlot) {
      const session = navigator.mediaSession;
      const { show } = schedule.onAirSlot;

      session.metadata = new MediaMetadata({
        title: `${show.emojiDescription} ${show.name}`,
        artist: "URF",
        artwork: generateMediaImages(show.cover.resource || defaultShowCoverResource)
      });
    }
  }, [schedule.onAirSlot]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = player.userState ? "playing" : "paused";
    }
  }, [player.userState]);

  if (!schedule.loaded || !streams.stream || !schedule.onAirSlot) {
    return null;
  }

  const {show, startDate, endDate} = schedule.onAirSlot;
  const stream = streams.stream;

  const endpoint = player.userState
    ? stream.proxyUrl
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
