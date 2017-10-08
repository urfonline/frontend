import React from 'react';
import { gql, graphql } from 'react-apollo';
import ShowsGrid from '../components/ShowsGrid';
import { Helmet } from 'react-helmet';
import { compose, withState } from 'recompose';

function Shows({ updateSortMethod, data: { currentSlate, loading } }) {
  return (
    <div className="Container">
      <Helmet>
        <title>Shows</title>
      </Helmet>
      <h1 className="Page__heading">Shows</h1>
      <div>
        Sort by
        <button onClick={() => updateSortMethod('NAME')}>Name</button>
        <button onClick={() => updateSortMethod('CATEGORY')}>Category</button>
      </div>
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

export default compose(
  graphql(HomeQuery),
  withState('sortMethod', 'updateSortMethod', 'NAME')
)(Shows);
