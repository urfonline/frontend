import React from 'react';
import groupBy from 'lodash/groupBy';
import ShowsGridItem from './ShowsGridItem';
import { Show } from '../../utils/types';
import styled from '@emotion/styled';
import {Box, Flex} from "@rebass/grid/emotion";

interface IProps {
  shows: Array<Show>;
  sortMethod: string; // todo: use enum
}


const GroupList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const GroupItem = styled.li``;

function ShowsGrid({ shows, sortMethod }: IProps) {
  const showsByLetter = groupBy(shows, (show: Show) => show.name[0]);
  const showsByCategory = groupBy(shows, (show: Show) => show.category.name);

  return (
    <GroupList>
      {Object.keys(sortMethod === 'CATEGORY' ? showsByCategory : showsByLetter)
        .sort()
        .map((groupKey) => (
          <GroupItem>
            <h2>{groupKey}</h2>
            <Flex mx={-2}  flexWrap="wrap">
            {showsByLetter[groupKey].map((show: Show) => (
                <Box width={[1, 1 / 2, 1 / 3, 1 / 4, 1]} px={2} mb={2}><ShowsGridItem show={show} key={show.id} /></Box>
              ))}
            </Flex>
          </GroupItem>
        ))}
    </GroupList>
  );
}

export default ShowsGrid;
