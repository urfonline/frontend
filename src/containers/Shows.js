import React from 'react';
import { gql, graphql } from 'react-apollo';
import ShowsGrid from '../components/ShowsGrid';
import { Helmet } from 'react-helmet';

function Shows({ data: { allShows, loading } }) {
  return (
    <div className="Container">
      <Helmet>
        <title>Shows</title>
      </Helmet>
      <h1 className="Page__heading">Shows</h1>
      {loading ? <h2>Loading</h2> : <ShowsGrid shows={allShows} />}
    </div>
  );
}

const HomeQuery = gql`
  query HomeQuery {
    allShows {
      id
      name
      slug
      brandColor
      cover
      shortDescription
    }
  }
`;

export default graphql(HomeQuery)(Shows);
