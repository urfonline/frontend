import './css/screen.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import createStore from './redux/configureStore'
import App from './containers/App'
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(undefined, {
  history,
  sagaMiddleware,
});

ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
), document.querySelector('.js__app'));

