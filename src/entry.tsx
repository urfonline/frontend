import './css/screen.css';
import 'unfetch/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/configureStore';
import App from './containers/App';

import { ApolloProvider } from 'react-apollo';
import { HttpLink, ApolloClient, InMemoryCache } from 'apollo-client-preset';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from '../fragmentTypes.json';
import { StoreContext } from 'redux-react-hook';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekDay from 'dayjs/plugin/weekday';
import TimeZone from './utils/TimeZone';

import { API_HOST } from './config';

import 'dayjs/locale/en-gb';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(weekDay);
dayjs.extend(TimeZone);

dayjs.locale('en-gb');

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const link = new HttpLink({
  uri: `${API_HOST}/graphql`
});
//
// link.use([
//   {
//     applyMiddleware(req, next) {
//       if (!req.options.headers) {
//         req.options.headers = {}; // Create the header object if needed.
//       }
//       // get the authentication token from local storage if it exists
//       const token = localStorage.getItem('token');
//       req.options.headers.authorization = token ? `Token ${token}` : null;
//       next();
//     },
//   },
// ]);

const cache: any = new InMemoryCache({
  fragmentMatcher,
});

const apolloClient = new ApolloClient({
  link,
  cache,
});

const store = createStore(undefined);

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <StoreContext.Provider value={store}>
        <ApolloHooksProvider client={apolloClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApolloHooksProvider>
      </StoreContext.Provider>
    </Provider>
  </ApolloProvider>,
  document.querySelector('.js__app'),
);
