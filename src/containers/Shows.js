import React from 'react';
import { gql, graphql } from 'react-apollo';
import ShowsGrid from '../components/ShowsGrid';
import { Helmet } from 'react-helmet';

function Shows({ data: { currentSlate, loading } }) {
  return (
    <div className="Container">
      <Helmet>
        <title>Shows</title>
      </Helmet>
      <h1 className="Page__heading">Shows</h1>
      {loading ? <h2>Loading</h2> : <ShowsGrid shows={currentSlate.shows} />}
    </div>
  );
}

const HomeQuery = gql`
  query showListings {
    currentSlate {
      shows {
        id
        name
        slug
        brandColor
        cover {
          resource
        }
        shortDescription
      }
    }
  }
`;

export default graphql(HomeQuery)(Shows);
