import React from 'react';
import FullSchedule from '../components/FullSchedule';
import { Helmet } from 'react-helmet';

const Schedule: React.FC = () => (
  <div>
    <Helmet>
      <title>Schedule</title>
    </Helmet>
    <div className="Container">
      <h1 className="Page__heading">Schedule</h1>
    </div>
    <FullSchedule/>
  </div>
);

export default Schedule;
