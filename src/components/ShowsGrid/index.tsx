import React from 'react';
import groupBy from 'lodash/groupBy';
import ShowsGridItem from './ShowsGridItem';
import { Show } from '../../utils/types';
import styled from '@emotion/styled';
import { Box, Flex } from '@rebass/grid/emotion';
import { SortMethod } from './types';

interface IProps {
  shows: Array<Show>;
  sortMethod: SortMethod;
}

const GroupList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const GroupItem = styled.li``;

function ShowsGrid({ shows, sortMethod }: IProps) {
  let groupedShows: { [index: string]: Array<Show> };

  if (sortMethod === SortMethod.Alpha) {
    groupedShows = groupBy(shows, (show: Show) => show.name[0].toUpperCase());
  } else {
    groupedShows = groupBy(shows, (show: Show) => show.category.name);
  }

  return (
    <GroupList>
      {Object.keys(groupedShows)
        .sort()
        .map((groupKey) => (
          <GroupItem key={groupKey}>
            <h2>{groupKey}</h2>
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
  );
}

export default ShowsGrid;
