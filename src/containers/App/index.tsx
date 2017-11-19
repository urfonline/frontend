import React from 'react';
import Header from '../../components/Header';
import Player from '../../components/Player';
import MainNavigation from '../../components/MainNavigation';
import { Route, Switch, withRouter } from 'react-router-dom';

import Home from '../Home';
import Schedule from '../Schedule';
import Shows from '../Shows';
import ShowBase from '../ShowBase';
import NotFound from '../NotFound/NotFound';
import WeAreURF from '../WeAreURF';
import Article from '../Article';
import Event from '../Event';
import NewsAndEvents from '../NewsAndEvents';
import MembersApp from '../members/MembersApp';
import { Helmet } from 'react-helmet';
import Login from '../members/Login';
import { Redirect } from 'react-router';
import { loginRestoreAttempt } from '../../ducks/auth';
import { scheduleLoaded, updateOnAirSlot } from '../../ducks/schedule';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'redux';

interface IDispatchProps {
  loginRestoreAttempt(): void;
  updateOnAirSlot(): void;
  scheduleLoaded(schedule: any): void;
}

interface IAppProps {
  loading: boolean;
  data: any;
}

type IProps = IAppProps & IDispatchProps;

class App extends React.Component<IProps> {
  componentDidMount() {
    // setInterval();
    // try and re auth someone
    this.props.loginRestoreAttempt();

    setInterval(() => this.props.updateOnAirSlot(), 1000 * 30);
  }

  componentWillReceiveProps(nextProps: IAppProps) {
    const { loading, data } = nextProps;
    if (!loading && data) {
      this.props.scheduleLoaded(data);
    }
  }

  render() {
    return (
      <div>
        <Helmet titleTemplate="%s | URF" defaultTitle="URF" />
        <Header />
        <div className="Page">
          <MainNavigation mobile />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/schedule" exact component={Schedule} />
            <Route path="/shows" exact component={Shows as any} />
            <Route path="/news-events" exact component={NewsAndEvents} />
            <Route path="/we-are-urf" exact component={WeAreURF} />
            <Route path="/shows/:showSlug" component={ShowBase} />
            <Route path="/auth/login" component={Login} exact />
            <Route path="/members" component={MembersApp} />
            <Route path="/article/**-:articleId" component={Article} exact />
            <Route path="/event/**-:eventId" component={Event} exact />
            <Redirect path="/article" to="/news-events" exact />
            <Route component={NotFound} />
          </Switch>
          <Player />
        </div>
      </div>
    );
  }
}

const ScheduleQuery = gql`
  query ScheduleQuery {
    currentSlate {
      slots {
        show {
          name
          slug
          brandColor
          category {
            name
            slug
            color
          }
          cover {
            resource
          }
        }
        startTime
        endTime
        day
      }
    }
    automationShow {
      name
      slug
      brandColor
      cover {
        resource
      }
    }
  }
`;

export default compose(
  withRouter,
  connect<null, IDispatchProps>(null, {
    loginRestoreAttempt,
    scheduleLoaded,
    updateOnAirSlot,
  }),
  graphql(ScheduleQuery)
)(App) as any;
