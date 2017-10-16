import React from 'react';
import { connect } from 'react-redux';
import Image from './Image';
import PlayPauseButton from './PlayPauseButton';
import PlayerAudio from './PlayerAudio';
import { playerUserStateChange, playerAudioStateChange } from '../actions';

interface IProps {
  isLoading: boolean,
  shows: any, // todo
  slot: any,
  player: any,
  schedule: any,
  playerUserStateChange: any,
  playerAudioStateChange: any,
}

const Player: React.SFC<IProps> = (props: IProps) => {
  const { player, schedule } = props;

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
            onChange={state => playerUserStateChange(state)}
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
        onChange={(state: any) => playerAudioStateChange(state)}
      />
    </div>
  );
};

Player.defaultProps = {
  isLoading: true,
  shows: null,
  slot: null,
};

export default connect(state => ({
  player: state.player,
  schedule: state.schedule,
}), {
  playerUserStateChange,
  playerAudioStateChange
})(Player) as any;
