import React from 'react';
import styled from 'react-emotion';
import {Link, LinkProps} from "react-router-dom";
import Imgix from 'react-imgix';

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
}

function renderArticle(block: any) {
  const article = block.object;
  return (
    <BoxLink to={`/article/${article.slug}-${block.object.articleId}`} backgroundColor={'#fff'}>
      <Imgix type="bg" src={`https://urf.imgix.net/${article.featuredImage.resource}`}>
        <BoxInner>
          <Kicker>{article.tone}</Kicker>
          <BlockTitle>{article.title}</BlockTitle>
        </BoxInner>
      </Imgix>
    </BoxLink>
  );
}

function renderShow(block: any) {
  const show = block.object;
  return (
    <BoxLink to={`/shows/${show.slug}`} backgroundColor={`#${show.brandColor}`}>
      <BoxInner>
        <Kicker>Show</Kicker>
        <BlockTitle>{show.name}</BlockTitle>
        <Description>{show.shortDescription}</Description>
      </BoxInner>
    </BoxLink>
  );
}


export function HomepageBlock(props: IProps) {
  if (props.block.object.__typename === 'Article') {
    return renderArticle(props.block);
  }

  if (props.block.object.__typename === 'Show') {
    return renderShow(props.block);
  }

  return <div>missing type</div>
}
