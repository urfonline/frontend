import React from 'react';
import groupBy from 'lodash/groupBy';
import ShowsGridItem from './ShowsGridItem';

function ShowsGrid({ shows }) {
  const showsByLetter = groupBy(shows, show => show.name[0]);
  console.log(showsByLetter);
  return (
    <ul className="ShowsGrid">
      {Object.keys(showsByLetter).sort().map(groupKey => (
        <li className="ShowsGrid__group">
          <h2>{groupKey}</h2>
          <ul className="ShowsGrid__grid">
            {showsByLetter[groupKey].map(show => (
              <ShowsGridItem show={show} key={show.id} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default ShowsGrid;
