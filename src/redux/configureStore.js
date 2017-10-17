import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(
  initialState,
  { apolloClient, history, saga }
) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(
      routerMiddleware(history, saga),
      apolloClient.middleware(),
      ReduxThunk
    )
  );
  const store = createStore(
    rootReducer({ apollo: apolloClient.reducer() }),
    initialState,
    enhancer
  );

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
