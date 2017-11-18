import React from 'react';
import styled from 'react-emotion';
import Imgix from 'react-imgix';
import { ImageResource } from '../types';

const Headline = styled.h1`
  font-size: 2em;
  margin: 0;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(30, 30, 30, 0.3);
  padding-bottom: 1rem;
`;

const FeaturedImageContainer = styled(Imgix)`
  height: 40vh;
  min-height: 200px;
  display: flex;

  & .Container {
    margin-top: auto;
  }
`;

interface IProps {
  title: string;
  image: ImageResource;
}

export function ImageHeader(props: IProps) {
  return (
    <FeaturedImageContainer
      type="bg"
      src={`https://urf.imgix.net/${props.image.resource}`}
    >
      <div className="Container">
        <Headline>{props.title}</Headline>
      </div>
    </FeaturedImageContainer>
  );
}
