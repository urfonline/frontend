import React from 'react';
import { Route, Switch, Redirect, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import ArticlesRoot from './ArticlesRoot';
import { RootState } from '../../types';

interface IProps {
  auth: any; // todo
}

function MembersApp(props: IProps) {
  if (!props.auth.token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div>
      <div className="MembersBar">
        <div className="Container">
          <div className="MembersBar__inner">
            <span className="MembersBar__title">URF Members Area</span>

            <ul className="MembersBar__menu">
              <li>
                <NavLink
                  className="MembersBar__menu-item"
                  activeClassName="MembersBar__menu-item--active"
                  to="/members"
                  exact
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="MembersBar__menu-item"
                  activeClassName="MembersBar__menu-item--active"
                  to="/members/articles"
                >
                  Articles
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="Container">
        <Helmet titleTemplate="%s | URF Members" defaultTitle="URF Members" />
        <Switch>
          <Route path="/members/articles" component={ArticlesRoot} />
          <Route path="" component={Dashboard} exact />
        </Switch>
      </div>
    </div>
  );
}

export default connect((state: RootState) => ({
  auth: state.auth,
}))(MembersApp);
