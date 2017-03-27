import React from 'react';
import Header from '../../components/Header';
import Player from '../../components/Player';
import DevTool from '../../components/DevTool';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import Home from '../Home';
import NotFound from '../NotFound';

function App() {
  return (
    <div>
      <Header />
      <Player />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
      <DevTool />
    </div>
  );
}


export default App;
