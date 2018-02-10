import React from 'react';
import Spinner from './Spinner';

export function LoadableSpinner(props: { error: Error; pastDelay: boolean }) {
  if (props.error) {
    return <div>Error!</div>;
  } else if (props.pastDelay) {
    return <Spinner />;
  } else {
    return null;
  }
}
