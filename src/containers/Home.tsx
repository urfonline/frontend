import React from 'react';
import { gql, graphql } from 'react-apollo';
import TodaySchedule from '../components/TodaySchedule';

function Home() {
  return (
    <div>
      <div className="Container">
        <h1 className="Page__heading">Home</h1>
      </div>
      <TodaySchedule />
      <div className="Container">
        <h2>Feed</h2>
      </div>
    </div>
  );
}

const HomeQuery = gql`
  query HomeQuery {
    currentSlate {
      name
    }
  }
`;

export default graphql(HomeQuery)(Home);
