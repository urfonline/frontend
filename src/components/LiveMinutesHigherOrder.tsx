import React from 'react';
import { getZonedNow } from '../utils/schedule';

function getMinutes() {
  const now = getZonedNow();

  return now.diff(now.startOf('day'), 'minute');
}

interface IProps {}

interface IState {
  minutes: number;
}

export default (WrappedComponent: any) => {
  class LiveMinutesHigherOrder extends React.Component<IProps, IState> {
    private interval: any;

    constructor(props: IProps) {
      super(props);

      this.state = {
        minutes: getMinutes(),
      };
    }

    componentDidMount() {
      this.interval = setInterval(
        () => this.setState({ minutes: getMinutes() }),
        10000,
      );
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    render() {
      return <WrappedComponent minutes={this.state.minutes} {...this.props} />;
    }
  }

  return LiveMinutesHigherOrder;
};
