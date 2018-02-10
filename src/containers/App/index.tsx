import React from 'react';
import Header from '../../components/Header';
import Player from '../../components/Player';
import MainNavigation from '../../components/MainNavigation';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router';
import { loginRestoreAttempt } from '../../ducks/auth';
import { scheduleLoaded, updateOnAirSlot } from '../../ducks/schedule';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import { LoadableSpinner } from '../../components/LoadableSpinner';
import { RootState } from '../../types';
import { Show } from '../../utils/types';

const LoadableShowPage = Loadable({
  loader: () => import(/* webpackChunkName: "ShowBase" */ '../ShowBase'),
  loading: LoadableSpinner,
});

const LoadableHome = Loadable({
  loader: () => import(/* webpackChunkName: "Home" */ '../Home'),
  loading: LoadableSpinner,
});

const LoadableSchedule = Loadable({
  loader: () => import(/* webpackChunkName: "Schedule" */ '../Schedule'),
  loading: LoadableSpinner,
});

const LoadableShows = Loadable({
  loader: () => import(/* webpackChunkName: "Shows" */ '../Shows') as any,
  loading: LoadableSpinner,
});

const LoadableWeAreURF = Loadable({
  loader: () => import(/* webpackChunkName: "WeAreURF" */ '../WeAreURF'),
  loading: LoadableSpinner,
});

const LoadableNotFound = Loadable({
  loader: () =>
    import(/* webpackChunkName: "NotFound" */ '../NotFound/NotFound'),
  loading: LoadableSpinner,
});

const LoadableArticle = Loadable({
  loader: () => import(/* webpackChunkName: "Article" */ '../Article'),
  loading: LoadableSpinner,
});

const LoadableEvent = Loadable({
  loader: () => import(/* webpackChunkName: "Event" */ '../Event'),
  loading: LoadableSpinner,
});

const LoadableNewsAndEvents = Loadable({
  loader: () =>
    import(/* webpackChunkName: "NewsAndEvents" */ '../NewsAndEvents'),
  loading: LoadableSpinner,
});

const LoadableMembersApp = Loadable({
  loader: () =>
    import(/* webpackChunkName: "MembersApp" */ '../members/MembersApp'),
  loading: LoadableSpinner,
});

const LoadableLogin = Loadable({
  loader: () => import(/* webpackChunkName: "Loading" */ '../members/Login'),
  loading: LoadableSpinner,
});

interface IDispatchProps {
  loginRestoreAttempt(): void;
  updateOnAirSlot(): void;
  scheduleLoaded(schedule: any): void;
}

interface IAppProps {
  loading: boolean;
  data: any;
  isPlaying: boolean;
  currentlyOnAirShow: Show;
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
    const { isPlaying, currentlyOnAirShow } = this.props;

    return (
      <div>
        <Helmet
          titleTemplate={
            isPlaying
              ? `${currentlyOnAirShow.emojiDescription} | %s | URF`
              : '%s | URF'
          }
          defaultTitle={
            isPlaying ? `${currentlyOnAirShow.emojiDescription} | URF` : 'URF'
          }
        />
        <Header />
        <div className="Page">
          <MainNavigation mobile />
          <Switch>
            <Route path="/" exact component={LoadableHome} />
            <Route path="/schedule" exact component={LoadableSchedule} />
            <Route path="/shows" exact component={LoadableShows} />
            <Route
              path="/news-events"
              exact
              component={LoadableNewsAndEvents}
            />
            <Route path="/we-are-urf" exact component={LoadableWeAreURF} />
            <Route path="/shows/:showSlug" component={LoadableShowPage} />
            <Route path="/auth/login" component={LoadableLogin} exact />
            <Route path="/members" component={LoadableMembersApp} />
            <Route
              path="/article/**-:articleId"
              component={LoadableArticle}
              exact
            />
            <Route path="/event/**-:eventId" component={LoadableEvent} exact />
            <Redirect path="/article" to="/news-events" exact />
            <Route component={LoadableNotFound} />
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
          emojiDescription
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
      emojiDescription
      cover {
        resource
      }
    }
  }
`;

export default compose(
  withRouter,
  connect(
    (store: RootState) => ({
      isPlaying: store.player.userState === true,
      currentlyOnAirShow: store.schedule.currentlyOnAir
        ? store.schedule.currentlyOnAir.show
        : false,
    }),
    {
      loginRestoreAttempt,
      scheduleLoaded,
      updateOnAirSlot,
    },
  ),
  graphql(ScheduleQuery),
)(App) as any;
