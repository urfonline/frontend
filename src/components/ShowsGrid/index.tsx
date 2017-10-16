import React from 'react';
import groupBy from 'lodash/groupBy';
import ShowsGridItem from './ShowsGridItem';
import { Show } from '../../utils/types';

interface IProps {
  shows: Array<Show>;
  sortMethod: string; // todo: use enum
}

function ShowsGrid({ shows, sortMethod }: IProps) {
  const showsByLetter = groupBy(shows, (show: Show) => show.name[0]);
  const showsByCategory = groupBy(shows, (show: Show) => show.category.name);

  return (
    <ul className="ShowsGrid">
      {Object.keys(sortMethod === 'CATEGORY' ? showsByCategory : showsByLetter)
        .sort()
        .map(groupKey => (
          <li className="ShowsGrid__group">
            <h2>{groupKey}</h2>
            <ul className="ShowsGrid__grid">
              {showsByLetter[groupKey].map((show: Show) => (
                <ShowsGridItem show={show} key={show.id} />
              ))}
            </ul>
          </li>
        ))}
    </ul>
  );
}

export default ShowsGrid;
