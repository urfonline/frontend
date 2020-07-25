import React from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import ShowsGridItem from './ShowsGridItem';
import { Category, Show } from '../../utils/types';
import styled from '@emotion/styled';
import { Box, Flex } from '@rebass/grid/emotion';
import { SortMethod } from './types';

interface IProps {
  shows: Array<Show>;
  categories: Array<Category>;
  sortMethod: SortMethod;
}

const GroupList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const GroupItem = styled.li``;

const CategoryIcon = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-right: 10px;
`;

const GroupLinksContainer = styled.div`
  font-size: 1.2em;
  font-weight: 700;
  margin: 15px 0 -10px;
`;

const GroupLink = styled.a`
  color: #555;
  text-decoration: none;
  transition: color .25s;
  padding: 0 10px;
  
  &:visited {
    color: #555;
  }
  
  &:hover {
    color: #000;
  }
`;

function ShowsGrid({ shows, categories, sortMethod }: IProps) {
  let groupedShows: { [index: string]: Array<Show> };

  if (sortMethod === SortMethod.Alpha) {
    groupedShows = groupBy(shows, (show: Show) => show.name[0].toUpperCase());
  } else {
    groupedShows = groupBy(shows, (show: Show) => show.category.name);
  }

  let groupNames = Object.keys(groupedShows).sort();
  let categoryMap = keyBy(categories, (category) => category.name);

  return (
    <div>
      <GroupLinksContainer>
        {groupNames.map((groupKey) =>
          <GroupLink key={groupKey} href={`#show-group-${groupKey}`}>{groupKey}</GroupLink>
        )}
      </GroupLinksContainer>
      <GroupList>
        {groupNames.map((groupKey) => (
          <GroupItem key={groupKey} id={`show-group-${groupKey}`}>
            <h2>
              {sortMethod === SortMethod.Category && <CategoryIcon
                style={{ backgroundColor: `#${categoryMap[groupKey].color}` }}/>}
              {groupKey}
            </h2>
            <Flex mx={-2} flexWrap="wrap">
              {groupedShows[groupKey].map((show: Show) => (
                <Box width={[1, 1 / 2, 1 / 3, 1 / 4, 1]} px={2} mb={2} key={show.id}>
                  <ShowsGridItem show={show} />
                </Box>
              ))}
            </Flex>
          </GroupItem>
          ))}
      </GroupList>
    </div>
  );
}

export default ShowsGrid;
