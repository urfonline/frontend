import React from 'react';
import { Block } from './HomepageBlock';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { RootState } from '../types';
import * as PlayerActions from '../ducks/player';

const onAirStyles = css`
  color: white;
  cursor: pointer;
`;

interface IProps {
  player: any; // todo
  schedule: any; // todo
  playerUserStateChange: any; // todo
}

export function OnAirBlockComponent(props: IProps) {
  const { player, schedule } = props;

  if (schedule.isLoading) {
    return null;
  }

  const show = schedule.currentlyOnAir.show;

  return (
    <Block
      size={1}
      className={onAirStyles}
      backgroundColor={'rgb(177, 34, 32)'}
      kicker={player.userState ? 'Playing live' : 'On Air - click to play'}
      title={show.name}
      onClick={() => props.playerUserStateChange(true)}
    />
  );
}

export const OnAirBlock = connect(
  (store: RootState) => ({
    player: store.player,
    schedule: store.schedule,
  }),
  {
    playerUserStateChange: PlayerActions.playerUserStateChange,
  }
)(OnAirBlockComponent);
