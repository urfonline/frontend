import React from 'react';
import { Link } from 'react-router-dom';
import { getShowBrandTone, getShowColourHexString } from '../../utils/shows';
import { Show, Tone } from '../../utils/types';
import styled from '@emotion/styled';
import { COLORS } from '../../css/constants';

interface IProps {
  show: Show;
}

const Root = styled.div<{ tone: Tone }>(
  ({ tone }) => `
  margin-bottom: 1.5rem;
  color: ${tone === Tone.Light ? COLORS.ShowToneLight : COLORS.ShowToneDark}
`,
);

const ShowLink = styled(Link)<{ tone: Tone }>(
  ({ tone }) => `
    align-items: center;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(30, 30, 30, 0.2);
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 120px;
    justify-content: center;
    padding: 0.3rem;
    text-decoration: none;
    transition: transform 300ms ease;
    width: 100%;
    color: ${tone === Tone.Light ? COLORS.ShowToneLight : COLORS.ShowToneDark};

    &:hover {
      transform: scale(1.05);
    }
`,
);

const ShowTitle = styled.h1`
  flex: 1;
  font-size: 1.6rem;
  margin: 0;
  text-align: center;
`;

const ShowDescription = styled.p`
  color: #757575;
  font-size: 0.9em;
  padding-left: 0.8em;
  padding-right: 0.8em;
  text-align: center;
`;

// TODO: add style to anchor  style="{{ show.generate_branding_style }}"
function ShowsGridItem({ show }: IProps) {
  return (
    <Root tone={getShowBrandTone(show)}>
      <ShowLink
        tone={getShowBrandTone(show)}
        to={`/shows/${show.slug}`}
        style={{ backgroundColor: `#${getShowColourHexString(show)}` }}
      >
        <ShowTitle>{show.name}</ShowTitle>
      </ShowLink>
      <ShowDescription>{show.shortDescription}</ShowDescription>
    </Root>
  );
}

export default ShowsGridItem;
