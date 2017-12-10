import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ShowsGrid from '../components/ShowsGrid';
import { Helmet } from 'react-helmet';
import { withState } from 'recompose';
import { Show } from '../utils/types';
import { compose } from 'redux';
import Spinner from "../components/Spinner";

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
      <div style={{ display: 'none' }}>
        Sort by
        <button onClick={() => updateSortMethod('NAME')}>Name</button>
        <button onClick={() => updateSortMethod('CATEGORY')}>Category</button>
      </div>
      {loading ? (
        <Spinner />
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
  graphql<{}, {}, any>(HomeQuery),
  withState('sortMethod', 'updateSortMethod', 'NAME')
)(Shows);
