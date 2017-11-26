import React from 'react';
import { Block } from './HomepageBlock';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { RootState } from '../types';
import * as PlayerActions from '../ducks/player';
import Image from './Image';

const coverStyles = css`
  width: 80%;
  height: 80%;
  display: block;
  margin: 0 auto;
`;

const onAirStyles = css`
  color: rgb(177, 34, 32);
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
    >
      <Image
        className={coverStyles}
        src={show.cover.resource}
        width={128}
        height={128}
      />
    </Block>
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
