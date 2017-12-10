import React from 'react';
import {Block, BlockTitle} from './HomepageBlock';
import {css, cx} from 'emotion';
import { connect } from 'react-redux';
import { RootState } from '../types';
import * as PlayerActions from '../ducks/player';
import Image from './Image';
import {queries} from "../css/mq";
import {formatTime} from "../utils/schedule";

const coverStyles = css`
  width: 80%;
  height: 80%;
  display: block;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(30, 30, 30, 0.2);
  transition: box-shadow 300ms ease;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const onAirCoverStyles = css`
  box-shadow: 0 4px 18px rgba(30, 30, 30, 0.2);
`;

const centeredStyles = css`
  text-align: center;
`;

const onAirStyles = css`
  color: rgb(177, 34, 32);
  cursor: pointer;
  
  & img {
    display: none;
  }
  
  ${queries.large`
    & img {
      display: block;
    }
  `}
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
      onClick={() => props.playerUserStateChange(true)}
    >
      <div className={centeredStyles}>
        <Image
          className={cx(coverStyles, { [onAirCoverStyles]: player.userState })}
          src={show.cover.resource}
          width={128}
          height={128}
        />
        <BlockTitle>{show.name}</BlockTitle>
        <div>
          {formatTime(schedule.currentlyOnAir.startDate)}-{formatTime(schedule.currentlyOnAir.endDate)}
        </div>
      </div>
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
