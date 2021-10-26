import React, { useEffect } from 'react';
import Header from '../../components/Header';
import Player from '../../components/Player';
import MainNavigation from '../../components/MainNavigation';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router';
import { updateSlateChunks, updateSlot } from '../../ducks/schedule';
import { streamsLoaded } from '../../ducks/streams';
import Loadable from 'react-loadable';
import gql from 'graphql-tag';
import { LoadableSpinner } from '../../components/LoadableSpinner';
import { RootState } from '../../types';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { useQuery } from 'react-apollo-hooks';
import { chunkSlotsByDay, filterSlotsByWeek, getOnAirSlot } from '../../utils/schedule';
import ApiError from '../../components/ApiError';

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
  const { data, loading, error } = useQuery(ScheduleQuery);

  useEffect(() => {
    if (!loading && !error && data) {
      dispatch(streamsLoaded(data));
    }
  }, [loading, data]);

  const { isPlaying, stream, showNextWeek, onAirSlot } = useMappedState(
    (state: RootState) => ({
      isPlaying: state.player.userState === true,
      stream: state.streams.stream,
      showNextWeek: state.schedule.showNextWeek,
      onAirSlot: state.schedule.onAirSlot
    })
  );
  const dispatch = useDispatch();

  // This effect deals with keeping the schedule up to date.
  useEffect(() => {
    if(!stream || !stream.slate) return;

    const slate = stream.slate;

    let thisWeekFilter = Math.abs(slate.weekFromStart % 2 - 2);
    let nextWeekFilter = Math.abs(thisWeekFilter - 3);

    let slots = filterSlotsByWeek(slate.slots, showNextWeek ? nextWeekFilter : thisWeekFilter);
    let chunked = chunkSlotsByDay(slots, slate.automationShow);

    dispatch(updateSlateChunks(chunked, getOnAirSlot(chunked)));

    const interval = setInterval(() => {
      let slot = getOnAirSlot(chunked);

      dispatch(updateSlot(slot));
    }, 1000 * 30);

    return () => {
      clearInterval(interval);
    };
  }, [stream, showNextWeek]);

  if (error != null) {
    return <ApiError error={error} />
  }

  return (
    <div>
      <Helmet
        titleTemplate={
          (isPlaying && onAirSlot)
            ? `${onAirSlot.show.emojiDescription} | %s | URF`
            : '%s | URF'
        }
        defaultTitle={
          (isPlaying && onAirSlot) ? `${onAirSlot.show.emojiDescription} | URF` : 'URF'
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
      slug
      proxyUrl
      priorityOnline
      priorityOffline
      slate {
        name
        weekFromStart
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
          week
        }
      }
    }
  }
`;

export default App;
