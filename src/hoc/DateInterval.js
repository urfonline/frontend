import React from 'react';

export default (prefs, WrappedComponent) => class DateInterval extends React.Component {
  constructor(x, y) {
    super(x, y);

    this.state = {
      dateInterval: new Date(),
    };
  }

  componentDidMount() {
    setInterval(() => this.setState({ dateInterval: new Date() }), prefs.interval);
  }

  render() {
    return <WrappedComponent dateInterval={this.state.dateInterval} {...this.props} />;
  }
};
