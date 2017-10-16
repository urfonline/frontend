import React from 'react';
import cx from 'classnames';

interface IProps {
  featured: boolean,
  title: string,
  date: string,
  description: string,
}

function NewsItem(props: IProps) {
  return (
    <div className={cx('NewsItem', { 'NewsItem--featured': props.featured })}>
      <div className="TileImage">
        <img className="NewsItem__image" />
      </div>
      <div className="TileDetails">
        <div className="NewsItem__title">
          <h2 className="NewsItem__titletext">{props.title}</h2>
        </div>
        <div className="NewsItem__date">
          <small>{props.date}</small>
        </div>
        <div className="NewsItem__description">
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  );
}

export default NewsItem;
