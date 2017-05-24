import React from 'react';
import { gql, graphql } from 'react-apollo';
import FullSchedule from '../components/FullSchedule';

function Schedule({ data }) {
  return (
    <div>
      <div className="Container">
        <h1 className="Page__heading">Schedule</h1>
      </div>
      <FullSchedule schedule={data} />
    </div>
  );
}

const ScheduleQuery = gql`
  query ScheduleQuery {
    allSlots {
      show {
        name
        slug
        brandColor
      }
      startTime
      endTime
      day
    }
    automationShow {
      name
      slug
      brandColor
    }
  }
`;

export default graphql(ScheduleQuery)(Schedule);
