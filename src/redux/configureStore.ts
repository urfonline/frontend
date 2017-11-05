import { createStore, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(
  initialState: any,
) {
  const composeEnhancers =
    (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(
      ReduxThunk
    )
  );
  const store = createStore(
    rootReducer(),
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
