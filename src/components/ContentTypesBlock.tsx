import React from 'react';
import {css, cx} from 'emotion';
import {Block, BlockTitle, BlockKicker, BlockDescription} from './HomepageBlock';
import {getShowBrandTone} from "../utils/shows";
import Image from "./Image";
import styled from "react-emotion";
import {formatTime, parseTime} from "../utils/schedule";

interface IProps {
  block: {
    overrideTitle: string;
    overrideKicker: string;
    overrideDescription: string;
    overrideBackgroundColor: string;
    object: any;
  };
  size: 1 | 2 | 3;
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
`;

const ShowCover = styled.div`
  width: 40%;
  max-width: 100px;
  margin-right: 1em;
  
  & img {
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

const toneDarkStyles = css`
  color: black;
`;

const toneLightStyles = css`
  color: white;
`;

function renderArticle(props: IProps) {
  const article = props.block.object;
  return (
    <Block
      size={props.size}
      innerClassName={articleStyles}
      link={`/article/${article.slug}-${article.articleId}`}
      backgroundColor={'#fff'}
      kicker={props.block.overrideKicker || article.tone}
      title={props.block.overrideTitle || article.title}
      image={article.featuredImage}
      description={props.block.overrideDescription || article.shortDescription}
    />
  );
}

function renderShow(props: IProps) {
  const show = props.block.object;
  const tone = getShowBrandTone(show);
  return (
    <Block
      className={cx({ [toneDarkStyles]: tone === 'dark', [toneLightStyles]: tone === 'light', })}
      size={props.size}
      link={`/shows/${show.slug}`}
      backgroundColor={`#${show.brandColor}`}
    >
      <ShowBlockContainer>
        <ShowCover>
          <Image src={show.cover.resource} width={60} height={60} />
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
          <BlockDescription>{props.block.overrideDescription || show.shortDescription}</BlockDescription>
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
      backgroundColor={'#fff'}
      kicker={props.block.overrideKicker || 'Event'}
      title={props.block.overrideTitle || event.title}
      description={props.block.overrideDescription || event.shortDescription}
      image={props.block.object.featuredImage}
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
