import React from 'react';
import { gql, graphql } from 'react-apollo';
import FullSchedule from '../components/FullSchedule';
import { Helmet } from 'react-helmet';

function Schedule({ data }) {
  return (
    <div>
      <Helmet>
        <title>Schedule</title>
      </Helmet>
      <div className="Container">
        <h1 className="Page__heading">Schedule</h1>
      </div>
      <FullSchedule />
    </div>
  );
}

export default Schedule;
