import './css/screen.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './redux/configureStore';
import App from './containers/App';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  push,
} from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: process.env.NODE_ENV === 'production'
    ? 'https://api.urfonline.com/graphql'
    : 'http://localhost:8000/graphql',
});
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

ReactDOM.render(
  <ApolloProvider store={store} client={apolloClient}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </ApolloProvider>,
  document.querySelector('.js__app')
);
