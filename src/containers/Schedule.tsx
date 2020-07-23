import React from 'react';
import FullSchedule from '../components/FullSchedule';
import { Helmet } from 'react-helmet';
import WeekSelector from '../components/WeekSelector';

const Schedule: React.FC = () => (
  <div>
    <Helmet title="Schedule" />
    <div className="Container">
      <h1 className="Page__heading">Schedule</h1>
      <WeekSelector/>
    </div>
    <FullSchedule />
  </div>
);

export default Schedule;
