import './css/screen.css';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/configureStore';
import App from './containers/App';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import { loginRestoreAttempt } from './actions';

const networkInterface = createNetworkInterface({
  uri: process.env.NODE_ENV === 'production'
    ? 'https://api.urfonline.com/graphql'
    : 'http://localhost:8000/graphql',
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}; // Create the header object if needed.
      }
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem('token');
      req.options.headers.authorization = token ? `Token ${token}` : null;
      next();
    },
  },
]);

const apolloClient = new ApolloClient({
  networkInterface,
});
const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(undefined, {
  apolloClient,
  history,
  sagaMiddleware,
});

store.dispatch(loginRestoreAttempt());

ReactDOM.render(
  <ApolloProvider store={store} client={apolloClient}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </ApolloProvider>,
  document.querySelector('.js__app')
);
