import React from 'react';
import { gql, graphql } from 'react-apollo';
import Player from '../components/Player';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Player />
    </div>
  );
}

const HomeQuery = gql`
  query HomeQuery {
    allShows {
      title
      slug
      accentColor
    }
  }
`;

export default graphql(HomeQuery)(Home);
