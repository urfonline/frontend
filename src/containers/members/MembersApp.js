import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from './Login';
import { connect } from 'react-redux';

function MembersApp({ auth }) {
  if (auth.token) {
    return <h1>Hey logged in user!</h1>;
  }
  return (
    <div>
      <Helmet titleTemplate="%s | URF Members" defaultTitle="URF Members" />
      <Switch>
        <Route path="/members/login" component={Login} exact />
      </Switch>
    </div>
  );
}

export default connect(state => ({
  auth: state.auth,
}))(MembersApp);
