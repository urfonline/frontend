import React from 'react';
import startOfToday from 'date-fns/start_of_today';
import differenceInMinutes from 'date-fns/difference_in_minutes';

function getMinutes() {
  const midnight = startOfToday();
  const now = new Date();

  return differenceInMinutes(now, midnight);
}

export default WrappedComponent =>
  class LiveMinutesHigherOrder extends React.Component {
    constructor(x, y) {
      super(x, y);

      this.state = {
        minutes: getMinutes(),
      };
    }

    componentDidMount() {
      setInterval(() => this.setState({ minutes: getMinutes() }), 10000);
    }

    render() {
      return <WrappedComponent minutes={this.state.minutes} {...this.props} />;
    }
  };
