import React from 'react';
import Spinner from './Spinner';

export const LoadableSpinner = (props: {
  error: Error;
  pastDelay: boolean;
}) => {
  if (props.error) {
    throw props.error;
    return <div>Error!</div>;
  } else if (props.pastDelay) {
    return <Spinner />;
  } else {
    return null;
  }
};
