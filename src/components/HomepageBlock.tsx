import React from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import Imgix from 'react-imgix';
import { ImageResource } from '../types';
import { ConditionalWrap } from './CondittionalWrap';

const Box = styled.div`
  box-shadow: 0 1px 2px rgba(30, 30, 30, 0.1);
  display: block;
  background-color: ${(props: any) => props.backgroundColor};
  color: #ffffff;
  text-decoration: none;
  height: 100%;
`;

const BoxLink = Box.withComponent(Link);

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

interface IBlockProps {
  className?: string;
  innerClassName?: string;
  link?: string;
  onClick?(e: React.MouseEvent<HTMLDivElement>): void;
  backgroundColor: string;
  image?: ImageResource;
  kicker: string;
  title: string;
  description?: string;
}

export function Block(props: IBlockProps) {
  const inner = (
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
  );

  if (props.link) {
    return (
      <BoxLink
        to={props.link}
        backgroundColor={props.backgroundColor}
        className={props.className}
      >
        {inner}
      </BoxLink>
    );
  }

  return (
    <Box
      onClick={props.onClick}
      backgroundColor={props.backgroundColor}
      className={props.className}
    >
      {inner}
    </Box>
  )
}
