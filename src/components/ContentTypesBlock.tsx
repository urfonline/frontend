import React from 'react';
import { css } from 'emotion';
import {
  Block,
  BlockTitle,
  BlockKicker,
  BlockDescription,
} from './HomepageBlock';
import styled from '@emotion/styled';
import { formatTime, parseTime } from '../utils/schedule';
import { AspectRatio, OneImage } from './OneImage';
import { getShowColourHexString } from '../utils/shows';

interface IProps {
  block: {
    overrideTitle: string;
    overrideKicker: string;
    overrideDescription: string;
    overrideBackgroundColor: string;
    object: any;
  };
  size: 1 | 2 | 3;
  aspectRatio?: AspectRatio;
}

// TODO: move to a utils thing or i18n file
const DAYS_TEXT = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ShowBlockContainer = styled.div`
  display: flex;
  ${(props: any) => props.size > 2 && 'flex-direction: column;'};
`;

const sideBySideStyles = css`
  margin-right: 1em;
  width: 40%;
  max-width: 100px;
`;

const ShowCover = styled.div`
  ${(props: any) => props.size <= 2 && sideBySideStyles} & img {
    width: 100%;
    height: auto;
  }
`;

const eventStyles = css`
  color: black;
`;

const articleStyles = css`
  color: black;
`;

function renderArticle(props: IProps) {
  const article = props.block.object;
  return (
    <Block
      size={props.size}
      innerClassName={articleStyles}
      link={`/article/${article.slug}-${article.articleId}`}
      kicker={props.block.overrideKicker || article.tone}
      title={props.block.overrideTitle || article.title}
      image={article.featuredImage}
      description={props.block.overrideDescription || article.shortDescription}
      aspectRatio={props.aspectRatio}
    />
  );
}

function renderShow(props: IProps) {
  const show = props.block.object;
  return (
    <Block
      size={props.size}
      innerClassName={articleStyles}
      link={`/shows/${show.slug}`}
      backgroundColor={`#${getShowColourHexString(show)}`}
      aspectRatio={props.aspectRatio}
    >
      <ShowBlockContainer size={props.size}>
        <ShowCover size={props.size}>
          <OneImage
            src={show.cover.resource}
            aspectRatio={AspectRatio.r1by1}
            alt=""
          />
        </ShowCover>
        <div>
          <BlockKicker>{props.block.overrideKicker || 'Show'}</BlockKicker>
          <BlockTitle>{props.block.overrideTitle || show.name}</BlockTitle>
          <div>
            {show.slots.map((slot: any) => (
              <span>
                {DAYS_TEXT[slot.day]}s at{' '}
                {formatTime(parseTime(slot.startTime))}
              </span>
            ))}
          </div>
          <BlockDescription>
            {props.block.overrideDescription || show.shortDescription}
          </BlockDescription>
        </div>
      </ShowBlockContainer>
    </Block>
  );
}

function renderEvent(props: IProps) {
  const event = props.block.object;

  return (
    <Block
      innerClassName={eventStyles}
      size={props.size}
      link={`/event/${event.slug}-${event.eventId}`}
      kicker={props.block.overrideKicker || 'Event'}
      title={props.block.overrideTitle || event.title}
      description={props.block.overrideDescription || event.shortDescription}
      image={props.block.object.featuredImage}
      aspectRatio={props.aspectRatio}
    />
  );
}

export function HomepageBlock(props: IProps) {
  if (props.block.object.__typename === 'Article') {
    return renderArticle(props);
  }

  if (props.block.object.__typename === 'Show') {
    return renderShow(props);
  }

  if (props.block.object.__typename === 'Event') {
    return renderEvent(props);
  }

  return <div>missing type</div>;
}
