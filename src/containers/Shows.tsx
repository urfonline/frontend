import React, {useState} from 'react';
import gql from 'graphql-tag';
import ShowsGrid from '../components/ShowsGrid';
import { Helmet } from 'react-helmet';
import { Show } from '../utils/types';
import Spinner from '../components/Spinner';
import {useQuery} from "react-apollo-hooks";

interface Result {
  currentSlate: {
    shows: Array<Show>;
  };
}

enum SortMethod {
  Alpha = 'alpha',
  Category = 'category'
}

const Shows: React.FC = () => {
  const [sortMethod, updateSortMethod] = useState(SortMethod.Alpha);
  const { data, loading } = useQuery<Result>(HomeQuery);

  return (
    <div className="Container">
      <Helmet title="Shows" />
      <h1 className="Page__heading">Shows</h1>
      <div style={{ display: 'none' }}>
        Sort by
        <button onClick={() => updateSortMethod(SortMethod.Alpha)}>Name</button>
        <button onClick={() => updateSortMethod(SortMethod.Category)}>Category</button>
      </div>
      {loading || !data ? (
        <Spinner />
      ) : (
        <ShowsGrid shows={data.currentSlate.shows} sortMethod={sortMethod} />
      )}
    </div>
  );
};

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

export default Shows;
