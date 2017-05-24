import React from 'react';
import cx from 'classnames';
import Color from 'color';
import { gql, graphql } from 'react-apollo';
import Image from '../components/Image';
import { formatTime, parseTime, TIME_FORMAT } from '../utils/schedule';
import { Helmet } from 'react-helmet';

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

function ShowBase({ data: { show, loading } }) {
  let content;
  if (loading) {
    return (
      <div className="Container">
        <h2>Loading</h2>
      </div>
    );
  }

  const bgColor = Color(`#${show.brandColor}`)
    .desaturate(0.1)
    .lighten(0.1)
    .rgb();

  return (
    <div>
      <Helmet>
        <title>{show.name}</title>
      </Helmet>
      <div
        className={cx(
          'ShowHeader',
          `ShowHeader--tone-${bgColor.light() ? 'dark' : 'light'}`
        )}
        style={{
          backgroundColor: bgColor.string(),
        }}
      >
        <div className="Container">
          <div className="ShowHeader__container">
            <div className="ShowHeader__cover">
              <Image src={show.cover} />
            </div>
            <div className="ShowHeader__info">
              <h1 className="ShowHeader__show-title">
                {show.name} <span className="ShowHeader__members">
                  with Rachel Example and John Ala
                </span>
              </h1>
              <span className="ShowHeader__schedule-times">
                {show.slots.map(slot => (
                  <span>
                    {DAYS_TEXT[slot.day]}s
                    {' '}
                    at
                    {' '}
                    {formatTime(parseTime(slot.startTime))}
                  </span>
                ))}
              </span>
              <div className="ShowHeader__short-description">
                {show.shortDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Container">

        <h1>Content here!</h1>
      </div>
    </div>
  );
}

const ShowBaseQuery = gql`
  query ShowBaseQuery($showSlug: String) {
    show(slug: $showSlug) {
      id
      name
      slug
      shortDescription
      brandColor
      cover
      banner
      slots {
        startTime
        day
      }
    }
  }
`;

export default graphql(ShowBaseQuery, {
  options: props => ({
    variables: {
      showSlug: props.match.params.showSlug,
    },
  }),
})(ShowBase);
