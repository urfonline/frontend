import React from 'react';
import Header from '../../components/Header';
import Player from '../../components/Player';
import MainNavigation from '../../components/MainNavigation';
import { Route, Switch } from 'react-router-dom';

import Home from '../Home';
import Schedule from '../Schedule';
import Shows from '../Shows';
import ShowBase from '../ShowBase';
import NotFound from '../NotFound/NotFound';
import WeAreURF from '../WeAreURF';
import Article from '../Article';
import NewsAndEvents from '../NewsAndEvents';
import MembersApp from '../members/MembersApp';
import { Helmet } from 'react-helmet';
import Login from "../members/Login";
import {Redirect} from "react-router";

function App() {
  return (
    <div>
      <Helmet titleTemplate="%s | URF" defaultTitle="URF" />
      <Header />
      <div className="Page">
        <MainNavigation mobile />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/schedule" exact component={Schedule} />
          <Route path="/shows" exact component={Shows} />
          <Route path="/news-events" exact component={NewsAndEvents} />
          <Route path="/we-are-urf" exact component={WeAreURF} />
          <Route path="/shows/:showSlug" component={ShowBase} />
          <Route path="/auth/login" component={Login} exact />
          <Route path="/members" component={MembersApp} />
          <Route path="/article/**-:articleId" component={Article} exact />
          <Redirect path="/article" to="/news-events" exact />
          <Route component={NotFound} />
        </Switch>
        <Player />
      </div>
    </div>
  );
}

export default App;
