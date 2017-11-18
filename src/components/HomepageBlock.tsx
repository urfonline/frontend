import React from 'react';
import styled from 'react-emotion';
import { Link, LinkProps } from 'react-router-dom';
import Imgix from 'react-imgix';
import { ImageResource } from '../types';
import { ConditionalWrap } from './CondittionalWrap';
import { css } from 'emotion';

const BoxLink = styled<LinkProps, { backgroundColor: string }>(Link)`
  box-shadow: 0 1px 2px rgba(30, 30, 30, 0.1);
  display: block;
  background-color: ${(props: any) => props.backgroundColor};
  color: #ffffff;
  text-decoration: none;
`;

const BoxInner = styled.div`
  padding: 1rem;
`;

const BlockTitle = styled.h1`
  margin: 0;
`;

const Kicker = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Description = styled.div`
  font-size: 1rem;
`;

interface IProps {
  block: any;
  size: 1 | 2 | 3;
}

interface IBlockProps {
  className?: string;
  innerClassName?: string;
  link: string;
  backgroundColor: string;
  image?: ImageResource;
  kicker: string;
  title: string;
  description?: string;
}

function Block(props: IBlockProps) {
  return (
    <BoxLink
      to={props.link}
      backgroundColor={props.backgroundColor}
      className={props.className}
    >
      <ConditionalWrap
        condition={!!props.image}
        wrap={(children: any) => (
          <Imgix
            type="bg"
            src={`https://urf.imgix.net/${props.image && props.image.resource}`}
          >
            {children}
          </Imgix>
        )}
      >
        <BoxInner className={props.innerClassName}>
          <Kicker>{props.kicker}</Kicker>
          <BlockTitle>{props.title}</BlockTitle>
          {props.description && <Description>{props.description}</Description>}
        </BoxInner>
      </ConditionalWrap>
    </BoxLink>
  );
}

const articleStyles = css`
  padding-top: 8rem;
`;

function renderArticle(props: IProps) {
  const article = props.block.object;
  return (
    <Block
      innerClassName={articleStyles}
      link={`/article/${article.slug}-${article.articleId}`}
      backgroundColor={'#fff'}
      kicker={article.tone}
      title={article.title}
      image={article.featuredImage}
    />
  );
}

function renderShow(props: IProps) {
  const show = props.block.object;
  return (
    <Block
      link={`/shows/${show.slug}`}
      backgroundColor={`#${show.brandColor}`}
      kicker={'Show'}
      title={show.name}
      description={show.shortDescription}
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

  return <div>missing type</div>;
}
