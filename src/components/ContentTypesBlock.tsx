import React from 'react';
import { css } from 'emotion';
import {Block} from "./HomepageBlock";

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

const articleStyles = css`
  padding-top: 8rem;
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
      image={props.block.overrideDescription || article.featuredImage}
    />
  );
}

function renderShow(props: IProps) {
  const show = props.block.object;
  return (
    <Block
      size={props.size}
      link={`/shows/${show.slug}`}
      backgroundColor={`#${show.brandColor}`}
      kicker={props.block.overrideKicker || 'Show'}
      title={props.block.overrideTitle || show.name}
      description={props.block.overrideDescription || show.shortDescription}
    />
  );
}

function renderEvent(props: IProps) {
  const event = props.block.object;
  return (
    <Block
      size={props.size}
      link={`/event/${event.slug}-${event.eventId}`}
      backgroundColor={`grey`}
      kicker={props.block.overrideKicker || 'Event'}
      title={props.block.overrideTitle || event.title}
      description={props.block.overrideDescription || event.shortDescription}
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
