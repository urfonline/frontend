import React from 'react';
import groupBy from 'lodash/groupBy';
import ShowsGridItem from './ShowsGridItem';

function ShowsGrid({ shows }) {
  const showsByLetter = groupBy(shows, show => show.title.slice[0]);
  return (
    <ul className="ShowsGrid">
      <li className="ShowsGrid__group">
        <h2>Group</h2>
        <ul className="ShowsGrid__grid">
          {shows.map(show => <ShowsGridItem show={show} key={show.id} />)}
        </ul>
      </li>
    </ul>
  );
}

export default ShowsGrid;
