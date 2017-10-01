import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { getShowBrandTone } from '../../utils/shows';

// TODO: add style to anchor  style="{{ show.generate_branding_style }}"
function ShowsGridItem({ show }) {
  return (
    <li
      className={cx(
        'ShowsGrid__item',
        `ShowsGrid__item--tone-${getShowBrandTone(show)}`
      )}
    >
      <Link
        className="ShowsGrid__anchor"
        to={`/shows/${show.slug}`}
        style={{ backgroundColor: `#${show.brandColor}` }}
      >
        <h1 className={cx('ShowsGrid__title')}>{show.name}</h1>
      </Link>
      <p className="ShowsGrid__description">{show.shortDescription}</p>
    </li>
  );
}

export default ShowsGridItem;
