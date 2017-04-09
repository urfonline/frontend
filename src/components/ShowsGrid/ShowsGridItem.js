import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

// TODO: add style to anchor  style="{{ show.generate_branding_style }}"
function ShowsGridItem({ show }) {
  return (
    <li className={cx('ShowsGrid__item', `ShowsGrid__item--tone-${show.tone}`)}>
      <Link
        className="ShowsGrid__anchor"
        to={`/shows/${show.slug}`}
        style={{ backgroundColor: show.accentColor }}
      >
        {show.logo ? (
          <img className="ShowsGrid__logo" src="" alt={show.title} />
        ) : (
          <h1 className={cx('ShowsGrid__title', { 'srt': show.logo })}>{show.title}</h1>
        )}
      </Link>
      <p className="ShowsGrid__description">{show.description}</p>
    </li>
  );
}


export default ShowsGridItem;
