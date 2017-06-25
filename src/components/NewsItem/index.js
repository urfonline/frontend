import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import testImage from './Temple_Island.jpg';

function NewsItem(props) {
  return (
    <div className={cx('NewsItem', {'NewsItem--featured':props.featured})}>
      <div className="TileImage">
        <img className='Image' src={testImage} />
      </div>
      <div className="TileDetails">
        <div className = "Title"><h2 className="h-title">{props.title}</h2></div>
        <div className= "Date"><small>{props.date}</small></div>
        <div className= "Description"><p1>{props.description}</p1></div>
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
