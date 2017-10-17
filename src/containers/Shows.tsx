import React from 'react';
import { gql, graphql } from 'react-apollo';
import ShowsGrid from '../components/ShowsGrid';
import { Helmet } from 'react-helmet';
import { compose, withState } from 'recompose';
import { Show } from '../utils/types';

interface IProps {
  updateSortMethod: any; // todo
  data: any;
  currentSlate: {
    shows: Array<Show>;
  };
  sortMethod: string;
  children?: any;
}

function Shows(props: IProps) {
  const { updateSortMethod, data: { currentSlate, loading } } = props;

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
      {loading ? (
        <h2>Loading</h2>
      ) : (
        <ShowsGrid shows={currentSlate.shows} sortMethod={props.sortMethod} />
      )}
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
        category {
          name
          slug
        }
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
