import React from 'react';
import styled from 'react-emotion';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TodaySchedule from '../components/TodaySchedule';
import {HomepageBlock} from "../components/HomepageBlock";
import {keyBy} from 'lodash';
import { Flex, Box } from 'grid-emotion';

interface IProps {
  data: any;
}

const BlockContainer = styled.div`
  max-width: 1280px;
`;

function renderBlocks(props: IProps) {
  if (props.data.loading) {
    return <div>loading</div>;
  }

  if (props.data.error) {
    return <div>error</div>;
  }
  const byPosition = keyBy(props.data.homepage, 'position');

  return (
    <BlockContainer>
      <Flex mb={3}>
        <Box width={1}>
          <HomepageBlock block={byPosition.HERO} />
        </Box>
      </Flex>
      <Flex mx={-3}>
        <Box width={1/2} px={3}>
          <HomepageBlock block={byPosition.SEC_1} />
        </Box>
        <Box width={1/2} px={3}>
          <HomepageBlock block={byPosition.SEC_2} />
        </Box>
      </Flex>
    </BlockContainer>
  );
}

function Home(props: IProps) {
  return (
    <div>
      <div className="Container">
        <h2>ON AIR</h2>
        <div>The current show!</div>

        <h2>Our recommendations</h2>
        {renderBlocks(props)}

        <h2>Today's schedule</h2>
      </div>
      <TodaySchedule />
      <div className="Container">
        <h2>Feed</h2>
      </div>
    </div>
  );
}

const HomeQuery = gql`
  query HomeQuery {
    homepage {
      position
      object {
        __typename
        ... on Show {
          id
          slug
          name
          brandColor
          shortDescription
          slots {
            day
            startTime
            endTime
          }
        }
        ... on Article {
          id
          articleId
          title
          slug
          tone
          publishedAt
          authors {
            name
          }
          featuredImage {
            resource
          }
        }
      }
    }
  }
`;

interface QueryResponse {
  data: any;
}

type WrappedProps = QueryResponse & {}

export default graphql<QueryResponse, {},  WrappedProps>(HomeQuery)(Home);
