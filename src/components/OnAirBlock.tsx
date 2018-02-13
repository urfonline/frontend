import React from 'react';
import { Block, BlockKicker, BlockTitle } from './HomepageBlock';
import { css, cx } from 'emotion';
import { connect } from 'react-redux';
import { RootState } from '../types';
import * as PlayerActions from '../ducks/player';
import { formatTime } from '../utils/schedule';
import { AspectRatio, OneImage } from './OneImage';
import {defaultShowCoverResource} from "../utils/shows";

const coverStyles = css`
  width: 65%;
  height: 65%;
  display: block;
  margin: 1rem auto;
  box-shadow: 0 4px 12px rgba(30, 30, 30, 0.2);
  transition: box-shadow 300ms ease, transform 300ms ease;
`;

const onAirCoverStyles = css`
  box-shadow: 0 4px 18px rgba(30, 30, 30, 0.2);
  transform: scale(1.05);
`;

const centeredStyles = css`
  text-align: center;
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
      onClick={() => props.playerUserStateChange(!player.userState)}
    >
      <div className={centeredStyles}>
        <BlockKicker>
          {player.userState ? 'Playing live' : 'On Air - click to play'}
        </BlockKicker>
        <div
          className={cx(coverStyles, { [onAirCoverStyles]: player.userState })}
        >
          {' '}
          <OneImage
            src={show.cover.resource ? show.cover.resource : defaultShowCoverResource}
            aspectRatio={AspectRatio.r1by1}
            alt=""
          />
        </div>{' '}
        <BlockTitle>{show.name}</BlockTitle>
        <div>
          {formatTime(schedule.currentlyOnAir.startDate)}-{formatTime(
            schedule.currentlyOnAir.endDate,
          )}
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
  },
)(OnAirBlockComponent);
