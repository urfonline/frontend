import React from 'react';
import { Helmet } from 'react-helmet';

function NotFound() {
  return (
    <div className="Container">
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <h1 className="Page__heading">Not Found</h1>
    </div>
  );
}

export default NotFound;
