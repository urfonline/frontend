import React from 'react';
import { gql, graphql } from 'react-apollo';
import ShowsGrid from '../components/ShowsGrid';

function Shows({ data: { allShows, loading }}) {
  return (
    <div>
      <h1>Shows</h1>
      { loading ? (
        <h2>Loading</h2>
      ) : (
        <ShowsGrid shows={allShows} />
      )}
    </div>
  );
}

const HomeQuery = gql`
  query HomeQuery {
    allShows {
      id
      title
      tone
      slug
      accentColor
    }
  }
`;

export default graphql(HomeQuery)(Shows);
