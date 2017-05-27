import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers';
import DevTools from '../components/DevTool';

export default function configureStore(
  initialState,
  { apolloClient, history, saga }
) {
  const enhancer = compose(
    applyMiddleware(
      routerMiddleware(history, saga),
      apolloClient.middleware(),
      ReduxThunk
    ),
    DevTools.instrument()
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
