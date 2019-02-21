import React from 'react';

export default (prefs: { interval: number }, WrappedComponent: any) =>
  class DateInterval extends React.Component<any, { dateInterval: Date }> {
    constructor(props: any) {
      super(props);

      this.state = {
        dateInterval: new Date(),
      };
    }

    componentDidMount() {
      setInterval(
        () => this.setState({ dateInterval: new Date() }),
        prefs.interval,
      );
    }

    render() {
      return (
        <WrappedComponent
          dateInterval={this.state.dateInterval}
          {...this.props}
        />
      );
    }
  };
