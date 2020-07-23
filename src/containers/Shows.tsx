import React, { useState } from 'react';
import gql from 'graphql-tag';
import ShowsGrid from '../components/ShowsGrid';
import { Helmet } from 'react-helmet';
import { Show } from '../utils/types';
import Spinner from '../components/Spinner';
import { useQuery } from 'react-apollo-hooks';
import { SortMethod } from '../components/ShowsGrid/types';

interface Result {
  currentSlate: {
    shows: Array<Show>;
  };
}

interface ISortProps {
  text: string;
  method: SortMethod;
  active: SortMethod;
  changeSort(method: SortMethod): void;
}

function SortSelect({ text, method, active, changeSort }: ISortProps) {
  let isActive = active === method;

  return <span className={`Shows__SortSelect Shows__SortSelect__${isActive ? 'active': 'inactive'}`}
               onClickCapture={() => changeSort(method)}>
    {text}
  </span>
}

const Shows: React.FC = () => {
  const [sortMethod, updateSortMethod] = useState(SortMethod.Alpha);
  const { data, loading } = useQuery<Result>(HomeQuery);

  return (
    <div className="Container">
      <Helmet title="Shows" />
      <h1 className="Page__heading">Shows</h1>
      <h3 className="Shows__SortHeader">
        Sort&nbsp;
        <SortSelect text="by name" method={SortMethod.Alpha} active={sortMethod} changeSort={updateSortMethod}/> /&nbsp;
        <SortSelect text="by category" method={SortMethod.Category} active={sortMethod} changeSort={updateSortMethod}/>
      </h3>
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
