import React from 'react';
import { connect } from 'react-redux';
import Image from './Image';
import PlayPauseButton from './PlayPauseButton';
import PlayerAudio from './PlayerAudio';
import { playerAudioStateChange, playerUserStateChange } from '../ducks/player';
import {Link} from "react-router-dom";
import minimalisticTimeRenderer from "../utils/minimalTime";

interface IProps {
  isLoading: boolean;
  shows: any; // todo
  slot: any;
  player: any;
  schedule: any;
  playerUserStateChange: any;
  playerAudioStateChange: any;
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
      <div className="Container BleedLeftOnMobile">
        <div className="Player__container">
          <div className="Player__show-cover">
            <Image src={show.cover.resource} width={100} height={100} />
          </div>
          <div className="Player__content">
            <div className="Player__button">
              <PlayPauseButton
                isPlaying={player.userState}
                isLive={player.audioSourceType === 'live'}
                onChange={state => props.playerUserStateChange(state)}
              />
            </div>
            <Link className="Player__show-name" to={`/shows/${show.slug}`}>{show.name}</Link>
            <small>{minimalisticTimeRenderer(schedule.currentlyOnAir.startDate)}-{minimalisticTimeRenderer(schedule.currentlyOnAir.endDate)}</small>
          </div>
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
  state => ({
    player: state.player,
    schedule: state.schedule,
  }),
  {
    playerUserStateChange,
    playerAudioStateChange,
  }
)(Player) as any;
