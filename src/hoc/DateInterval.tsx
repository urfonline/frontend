import React from 'react';

export default (prefs: { interval: number }, WrappedComponent: any) =>
  class DateInterval extends React.Component<any, { dateInterval: Date }> {
    private interval: any;

    constructor(props: any) {
      super(props);

      this.state = {
        dateInterval: new Date(),
      };
    }

    componentDidMount() {
      this.interval = setInterval(
        () => this.setState({ dateInterval: new Date() }),
        prefs.interval,
      );
    }

    componentWillUnmount(): void {
      clearInterval(this.interval);
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
