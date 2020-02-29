import React, { useCallback, useEffect } from 'react';
import Header from '../../components/Header';
import Player from '../../components/Player';
import MainNavigation from '../../components/MainNavigation';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router';
import { loginRestoreAttempt } from '../../ducks/auth';
import { scheduleLoaded, updateOnAirSlot } from '../../ducks/schedule';
import Loadable from 'react-loadable';
import gql from 'graphql-tag';
import { LoadableSpinner } from '../../components/LoadableSpinner';
import { RootState } from '../../types';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { useQuery } from 'react-apollo-hooks';

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
  loader: () => import(/* webpackChunkName: "Shows" */ '../Shows'),
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

const LoadableApplicationForm = Loadable({
  loader: () => import(/* webpackChunkName: "ApplicationForm" */ '../Apply'),
  loading: LoadableSpinner,
});

const App: React.FC = () => {
  const { data, loading } = useQuery(ScheduleQuery);

  const mapState = useCallback(
    (store: RootState) => ({
      isPlaying: store.player.userState === true,
      currentlyOnAirShow: store.schedule.currentlyOnAir
        ? store.schedule.currentlyOnAir.show
        : false,
    }),
    [],
  );

  const { isPlaying, currentlyOnAirShow } = useMappedState(mapState);
  const dispatch = useDispatch();

  useEffect(() => {
    loginRestoreAttempt()(dispatch);

    const interval = setInterval(() => dispatch(updateOnAirSlot()), 1000 * 30);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!loading && data) {
      dispatch(scheduleLoaded(data));
    }
  }, [loading, data]);

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
          <Route path="/news-events" exact component={LoadableNewsAndEvents} />
          <Route path="/we-are-urf" exact component={LoadableWeAreURF} />
          <Route path="/shows/:showSlug" component={LoadableShowPage} />
          <Route path="/auth/login" component={LoadableLogin} exact />
          <Route path="/members" component={LoadableMembersApp} />
          <Route path="/apply" component={LoadableApplicationForm} />
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
};

const ScheduleQuery = gql`
  query ScheduleQuery {
    allStreams {
      id
      name
      mountpoint
      slug
      host
      port
      proxyUrl
      mobileMountpoint
      priorityOnline
      priorityOffline
      slate {
        automationShow {
          id
          name
          slug
          brandColor
          emojiDescription
          cover {
            resource
          }
        }
        slots {
          show {
            id
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
          id
          startTime
          endTime
          day
#          week
        }
      }
    }
  }
`;

export default App;
