import React from 'react';
import { gql, graphql } from 'react-apollo';
import Player from '../components/Player';

function Home() {
  return (
    <div className="Container">
      <h1 className="Page__heading">Home</h1>
      <Player />
    </div>
  );
}

const HomeQuery = gql`
  query HomeQuery {
    allShows {
      name
      slug
      brandColor
    }
  }
`;

export default graphql(HomeQuery)(Home);
