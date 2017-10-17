import { Store } from 'redux';
import { gql, ApolloClient } from 'react-apollo';
import { scheduleLoaded } from "../ducks/schedule"

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

export default function(apolloClient: ApolloClient, store: Store<any>) {
  apolloClient
    .query({
      query: ScheduleQuery,
    })
    .then(res => store.dispatch(scheduleLoaded(res.data)));
}
