import React from 'react';
import { Helmet } from 'react-helmet';

function NotFound() {
  return (
    <div className="Container">
      <Helmet>
        <title>News {'&'} Events</title>
      </Helmet>
      <h1 className="Page__heading">News {'&'} Events</h1>
    </div>
  );
}

export default NotFound;
