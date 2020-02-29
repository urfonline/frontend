import React from 'react';
import cx from 'classnames';
import Color from 'color';
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import { formatTime, parseTime } from '../utils/schedule';
import { Helmet } from 'react-helmet';
import styled from '@emotion/styled';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { queries } from '../css/mq';
import { AspectRatio, OneImage } from '../components/OneImage';
import {
  defaultShowCoverResource,
  getShowColourHexString,
} from '../utils/shows';
import { useQuery } from 'react-apollo-hooks';
import { Show } from '../utils/types';

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

const ShowMain = styled.div`
  ${queries.large`
    display: flex;
  `};
`;

const ShowSidebar = styled.div`
  ${queries.large`
    width: calc(200px + 2rem);
    flex: none;
  `};
`;

const MixCloudButton = styled.a`
  background-color: #52aad8;
  color: #ffffff !important;
  text-shadow: 0 1px rgba(30, 30, 30, 0.3);
  padding: 0.2rem;
`;

console.log(queries.large`
    padding-left: calc(200px + 2rem);
    margin-bottom: 2rem;
  `);

const ShowMenu = styled.ul`
  list-style: none;
  padding: 0;

  ${queries.large`
    padding-left: calc(200px + 2rem);
    margin-bottom: 2rem;
  `}

  & li {
    display: inline-block;
    margin-right: 1rem;
  }

  & a {
    text-decoration: none;
    font-size: 1.2rem;
    color: #757575;
  }

  & a.active {
    text-decoration: underline;
  }
`;

interface IProps extends RouteComponentProps<{ showSlug: string }> {}

const ShowBase: React.FC<IProps> = (props) => {
  const { data, loading } = useQuery(ShowBaseQuery, {
    variables: {
      showSlug: props.match.params.showSlug,
    },
  });

  if (loading || !data) {
    return (
      <div>
        <div className={cx('ShowHeader', 'ShowHeader--loading')}>
          <div className="Container">
            <div className="ShowHeader__container">
              <div className="ShowHeader__cover" />
              <div className="ShowHeader__info" />
            </div>
          </div>
        </div>
        <div className="Container" />
      </div>
    );
  }

  const { show }: { show: Show } = data;

  const bgColor = Color(`#${getShowColourHexString(show)}`)
    .desaturate(0.1)
    .lighten(0.1)
    .rgb();

  return (
    <div>
      <Helmet title={show.name} />
      <div
        className={cx(
          'ShowHeader',
          `ShowHeader--tone-${bgColor.isLight() ? 'dark' : 'light'}`,
        )}
        style={{
          backgroundColor: bgColor.string(),
        }}
      >
        <div className="Container">
          <div className="ShowHeader__container">
            <div className="ShowHeader__cover">
              <OneImage
                src={
                  (show.cover && show.cover.resource)
                    ? show.cover.resource
                    : defaultShowCoverResource
                }
                aspectRatio={AspectRatio.r1by1}
                alt=""
              />
            </div>
            <div className="ShowHeader__info">
              <h1 className="ShowHeader__show-title">{show.name}</h1>
              <span className="ShowHeader__schedule-times">
                {show.slots && show.slots.map((slot) => (
                  <span key={slot.id}>
                    {DAYS_TEXT[slot.day]}s at{' '}
                    {formatTime(parseTime(slot.startTime))}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="Container">
        <ShowMenu>
          <li>
            <NavLink to={`/shows/${show.slug}/`}>About</NavLink>
          </li>
          <li>
            {show.socialMixcloudHandle && (
              <MixCloudButton
                href={`https://mixcloud.com/${show.socialMixcloudHandle}`}
              >
                Listen back
              </MixCloudButton>
            )}
          </li>
        </ShowMenu>
      </div>
      <div className="Container">
        <ShowMain>
          <ShowSidebar>
            <ul>
              <li>Est. {dayjs(show.createdAt).format('MMM YYYY')}</li>
            </ul>
          </ShowSidebar>
          <div className="ShowHeader__short-description">
            {show.longDescription}
          </div>
        </ShowMain>
      </div>
    </div>
  );
};

const ShowBaseQuery = gql`
  query ShowBaseQuery($showSlug: String) {
    show(slug: $showSlug) {
      id
      name
      slug
      shortDescription
      longDescription
      brandColor
      socialMixcloudHandle
      createdAt
      cover {
        resource
      }
      cover {
        resource
      }
      slots {
        id
        startTime
        day
      }
    }
  }
`;

export default ShowBase;
