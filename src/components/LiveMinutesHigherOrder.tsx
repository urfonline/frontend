import React from 'react';
import startOfDay from 'date-fns/startOfDay';
import differenceInMinutes from 'date-fns/differenceInMinutes';

function getMinutes() {
  const midnight = startOfDay(new Date());
  const now = new Date();

  return differenceInMinutes(now, midnight);
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

    componentDidLeave() {
      clearInterval(this.interval);
    }

    render() {
      return <WrappedComponent minutes={this.state.minutes} {...this.props} />;
    }
  }

  return LiveMinutesHigherOrder;
};
