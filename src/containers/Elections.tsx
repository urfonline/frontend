import React from 'react';
import Helmet from 'react-helmet';
import { Box, Flex } from '@rebass/grid/emotion';
import styled from '@emotion/styled';
import { Block } from '../components/HomepageBlock';
import { defaultShowCoverResource } from '../utils/shows';
import { css } from 'emotion';
import { AspectRatio, OneImage } from '../components/OneImage';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Spinner from '../components/Spinner';
import { queries } from '../css/mq';

const ElectionsHeaderBox = styled.div`
  padding: 10px 0;
  background-color: rgb(42, 37, 38);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%2330d1d2' fill-opacity='0.48'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E");
`;

const BigTitle = styled.h1`
  text-transform: uppercase;
  text-align: center;
  font-style: italic;
  margin: 0;
  color: #fff;
  font-size: 4rem;
  text-shadow: 4px 4px 0 rgb(176, 39, 39);

  ${queries.large`
    font-size: 8rem;
  `}
`;

const TextContainer = styled.div`
  margin: 0 auto;
  max-width: 900px;
  text-align: center;
`;

const PositionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
`;

const CandidatesContainer = styled.div`
  padding: 0 20px;
`;

const CandidateImageLeft = css`
  float: left;
  max-height: 128px;
  margin: 10px;

  ${queries.large`
    margin: 15px 0 0 30px;
  `}
`;

const CandidateImageRight = css`
  float: right;
  max-height: 128px;
  margin: 10px;

  ${queries.large`
    margin: 15px 30px 0 0;
  `}
`;

const CandidateBlock = css`
  padding: 5px 5px 0;

  & h1 {
    font-size: 3.5vh;
    word-break: break-word;

    ${queries.large`
      font-size: 4vh;
    `}
  }
`

const CandidateBlockLeft = css`
  ${CandidateBlock}

  ${queries.large`
    margin-left: 148px;
  `}
`;

const CandidateBlockRight = css`
  ${CandidateBlock}

  text-align: right;

  ${queries.large`
    margin-right: 148px;
  `}
`;

const CandidateBlockInner = css`
  display: block;
`;

const CandidateBio = styled.pre`
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 0.85em;
  text-align: left;
`;

const VotingNotification = css`
  color: #28359a;
`;

interface CandidateInfo {
  id: string,
  name: string,
  bio: string,
  image?: string,
}

interface CandidateProps {
  candidate: CandidateInfo,
  position: string,
  odd: boolean,
}

interface Position {
  id: string,
  name: string,
  candidates: Array<CandidateInfo>,
}

interface PositionProps {
  positions: Array<Position>,
}

function Candidate({ candidate, odd }: CandidateProps) {
  const image = candidate.image
    ? { resource: candidate.image }
    : { resource: defaultShowCoverResource };

  return <Box width={[1, 1 / 2]} px={10} mb={20}>
    <OneImage src={image.resource} aspectRatio={AspectRatio.r1by1}
              sizes={[128, 256]} alt={candidate.name} withoutContainer
              className={odd ? CandidateImageRight : CandidateImageLeft} />
    <Block size={1} title={candidate.name} innerClassName={CandidateBlockInner}
           kicker="Candidate" className={odd ? CandidateBlockRight : CandidateBlockLeft}>
      <CandidateBio>{candidate.bio}</CandidateBio>
    </Block>
  </Box>
}

function CandidateList({ positions }: PositionProps) {
  return <CandidatesContainer>
    {positions.filter(pos => pos.candidates.length > 0).map(pos =>
      <div key={pos.id}>
        <PositionTitle>{pos.name}</PositionTitle>
        <Flex mx={-2} flexWrap="wrap">
          {pos.candidates.map((candidate, i) =>
            <Candidate candidate={candidate} position={pos.name}
                       key={candidate.id} odd={i % 2 != 0} />)
          }
        </Flex>
      </div>
    )}
  </CandidatesContainer>
}

function ElectionsHeader() {
  return <ElectionsHeaderBox>
    <BigTitle>Elections</BigTitle>
  </ElectionsHeaderBox>
}

const ElectionsQuery = gql`
  query ElectionsQuery {
    allPositions {
      id
      name
      candidates {
        id
        name
        bio
        image
      }
    }
  }
`;

// going to manually remove this when this election is over.
// ideally we don't run another online election ever again,
// so very little point in adding a whole shebang to the API.
// the candidate listing can be used regardless though, that's
// good for promotion
const ELECTIONS_LINK =
  "https://docs.google.com/forms/d/e/1FAIpQLSeqi3jGP1XVabz5vzI3qkPe_EWNF3i04AeTwAkmF0roOjRL9w/viewform";

export function ElectionsContainer() {
  const {data, error, loading} = useQuery(ElectionsQuery);

  // future work: disable this page when there isn't an election on.
  // will be doing it manually for now.
  return <div>
    <Helmet title="Elections" />
    <ElectionsHeader/>
    <TextContainer>
      <p>It's election season! See the candidates running for the URF exec this year.</p>
      <Block size={1} title="Voting is now open!" href={ELECTIONS_LINK} className={VotingNotification}
             description="Click here to vote in the URF Exec election!" />
      {error && <p>Failed to retrieve candidate list: {error}</p>}
    </TextContainer>
    {loading && <Spinner />}
    {!loading && data.allPositions && <CandidateList positions={data.allPositions} />}
  </div>
}
