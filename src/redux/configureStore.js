import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import DevTools from '../components/DevTool';
import { routerMiddleware } from 'react-router-redux'

export default function configureStore(initialState, { history, saga }) {
  const enhancer = compose(
    applyMiddleware(routerMiddleware(history, saga)),
    DevTools.instrument(),
  );
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
