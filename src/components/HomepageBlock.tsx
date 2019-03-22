import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { ImageResource } from '../types';
import { css, cx } from 'emotion';
import { AspectRatio, OneImage } from './OneImage';

const Box = styled.div`
  box-shadow: 0 1px 6px rgba(30, 30, 30, 0.1);
  display: block;
  ${(props: any) =>
    props.accentColor
      ? `border-top: 6px solid ${props.accentColor};`
      : `padding-bottom: 6px;`};
  text-decoration: none;
  height: 100%;
  background-color: #ffffff;
  border-radius: 1px;
  transition: box-shadow 300ms ease;

  &:hover {
    box-shadow: 0 1px 9px rgba(30, 30, 30, 0.15);
  }
`;

export const BoxLink = Box.withComponent(Link);

export const BoxInner = styled.div`
  padding: 1rem;
`;

export const BlockTitle = styled.h1`
  font-size: 1.6em;
  line-height: 1;
  margin: 0 0 0.4rem;
`;

export const BlockKicker = styled.div`
  color: #4a4a4a;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: 0.2rem;
`;

export const BlockDescription = styled.div`
  font-size: 0.85em;
`;

const imageScaleStyle = css`
  width: 100%;
  height: auto;
`;

export const oneSizingStyle = css`
  font-size: 1.2rem;
`;

export const twoSizingStyle = css`
  font-size: 1rem;
`;

export const threeSizingStyle = css`
  font-size: 1rem;
`;

interface IBlockProps {
  className?: string;
  innerClassName?: string;
  link?: string;
  onClick?(e: React.MouseEvent<HTMLDivElement>): void;
  backgroundColor?: string;
  image?: ImageResource;
  kicker?: string;
  title?: string;
  description?: string;
  size: 1 | 2 | 3;
  children?: any;
  aspectRatio?: AspectRatio;
}

export function Block(props: IBlockProps) {
  const classNames = cx(props.className, {
    [oneSizingStyle]: props.size === 1,
    [twoSizingStyle]: props.size === 2,
    [threeSizingStyle]: props.size === 3,
  });

  const inner = (
    <div>
      {props.image && (
        <OneImage
          className={imageScaleStyle}
          src={props.image.resource}
          aspectRatio={props.aspectRatio || AspectRatio.rPanovision70}
          alt=""
        />
      )}
      <BoxInner className={props.innerClassName}>
        {props.kicker && <BlockKicker>{props.kicker}</BlockKicker>}
        {props.title && <BlockTitle>{props.title}</BlockTitle>}
        {props.description && (
          <BlockDescription>{props.description}</BlockDescription>
        )}
        {props.children && props.children}
      </BoxInner>
    </div>
  );

  if (props.link) {
    return (
      <BoxLink
        to={props.link}
        accentColor={props.backgroundColor}
        className={classNames}
      >
        {inner}
      </BoxLink>
    );
  }

  return (
    <Box
      onClick={props.onClick}
      accentColor={props.backgroundColor}
      className={classNames}
    >
      {inner}
    </Box>
  );
}
