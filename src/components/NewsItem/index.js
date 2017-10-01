import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import testImage from './Temple_Island.jpg';

function NewsItem(props) {
  return (
    <div className={cx('NewsItem', { 'NewsItem--featured': props.featured })}>
      <div className="TileImage">
        <img className="NewsItem__image" src={testImage} />
      </div>
      <div className="TileDetails">
        <div className="NewsItem__title">
          <h2 className="NewsItem__titletext">{props.title}</h2>
        </div>
        <div className="NewsItem__date">
          <small>{props.date}</small>
        </div>
        <div className="NewsItem__description">
          <p1>{props.description}</p1>
        </div>
      </div>
    </div>
  );
}

NewsItem.propTypes = {
  featured: PropTypes.bool,
};

NewsItem.defaultProps = {
  featured: false,
};

export default NewsItem;

/**
 * Created by Fin on 24/06/2017.
 */
