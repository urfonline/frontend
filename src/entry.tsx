import './css/screen.css';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/configureStore';
import App from './containers/App';
import { ApolloProvider } from 'react-apollo';
import { HttpLink, ApolloClient, InMemoryCache } from 'apollo-client-preset';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

const link = new HttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://api.urfonline.com/graphql'
      : 'https://api.urfonline.com/graphql', // 'http://localhost:8000/graphql',
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

const cache: any = new InMemoryCache();

const apolloClient = new ApolloClient({
  link,
  cache,
}) as any;

const store = createStore(undefined);

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.querySelector('.js__app')
);
