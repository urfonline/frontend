import React from 'react';
import styled from 'react-emotion';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TodaySchedule from '../components/TodaySchedule';
import { keyBy } from 'lodash';
import { Flex, Box } from 'grid-emotion';
import {HomepageBlock} from "../components/ContentTypesBlock";
import {OnAirBlock} from "../components/OnAirBlock";

interface IProps {
  data: any;
}

const WelcomeHeading = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  
  @media (min-width: 960px) {
    font-size: 2.8rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  
  @media (min-width: 1440px) {
    font-size: 4.1rem;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
`;

const BlockContainer = styled.div`
  max-width: 1440px;
`;

function renderBlocks(props: IProps) {
  if (props.data.loading) {
    return <div>loading</div>;
  }

  if (props.data.error) {
    return <div>error</div>;
  }
  const byPosition = keyBy(props.data.homepage, 'position');

  const hasHero = byPosition.hasOwnProperty('HERO');
  const hasSecondary =
    byPosition.hasOwnProperty('SEC_1') && byPosition.hasOwnProperty('SEC_2');
  const hasThirds =
    byPosition.hasOwnProperty('THIRD_1') &&
    byPosition.hasOwnProperty('THIRD_2') &&
    byPosition.hasOwnProperty('THIRD_3');

  return (
    <BlockContainer>
      {hasHero && (
        <Flex mx={-2} mb={2}>
          <Box width={[1, 400]} px={2}>
            <OnAirBlock />
          </Box>
          <Box width={1} px={2}>
            <HomepageBlock block={byPosition.HERO} size={1} />
          </Box>
        </Flex>
      )}
      {hasSecondary && (
        <Flex mx={-2} mb={2}>
          <Box width={[1, 1 / 2]} px={2}>
            <HomepageBlock block={byPosition.SEC_1} size={2} />
          </Box>
          <Box width={[1, 1 / 2]} px={2}>
            <HomepageBlock block={byPosition.SEC_2} size={2} />
          </Box>
        </Flex>
      )}
      {hasThirds && (
        <Flex mx={-2} mb={2}>
          <Box width={[1, 1 / 3]} px={2}>
            <HomepageBlock block={byPosition.THIRD_1} size={3} />
          </Box>
          <Box width={[1, 1 / 3]} px={2}>
            <HomepageBlock block={byPosition.THIRD_2} size={3} />
          </Box>
          <Box width={[1, 1 / 3]} px={2}>
            <HomepageBlock block={byPosition.THIRD_3} size={3} />
          </Box>
        </Flex>
      )}
    </BlockContainer>
  );
}

function Home(props: IProps) {
  return (
    <div>
      <div className="Container">
        <WelcomeHeading>The Soundtrack to Sussex Since 1976</WelcomeHeading>
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
      overrideTitle
      overrideKicker
      overrideDescription
      overrideBackgroundColor
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
        ... on Event {
          id
          eventId
          title
          slug
          startDate
          shortDescription
          slug
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

type WrappedProps = QueryResponse & {};

export default graphql<QueryResponse, {}, WrappedProps>(HomeQuery)(Home);
