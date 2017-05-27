import React from 'react';
import cx from 'classnames';
import Color from 'color';
import { Link } from 'react-router-dom';
import { getShowBrandTone } from '../../utils/shows';
import Image from '../Image';

// TODO: add style to anchor  style="{{ show.generate_branding_style }}"
function ShowsGridItem({ show }) {
  const showColor = Color(`#${show.brandColor}`)
    .darken(0.7)
    .rgb()
    .round()
    .array();

  return (
    <li
      className={cx(
        'ShowsGrid__item',
        `ShowsGrid__item--tone-${getShowBrandTone(show)}`
      )}
    >
      <Link className="ShowsGrid__anchor" to={`/shows/${show.slug}`}>
        <Image className="ShowsGrid__cover" src={show.cover.resource} />
        <h1
          className={cx('ShowsGrid__title')}
          style={{
            background: `linear-gradient(to bottom, rgba(${showColor.join(',')}, 0) 0%, rgba(${showColor.join(',')}, 0.65) 100%)`,
          }}
        >
          {show.name}
        </h1>
      </Link>
      <p className="ShowsGrid__description">{show.shortDescription}</p>
    </li>
  );
}

export default ShowsGridItem;
