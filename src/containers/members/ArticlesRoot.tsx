import React from 'react';
import { connect } from 'react-redux';
import {Route, Switch} from "react-router-dom";
import ArticleEditor from "./ArticleEditor";
import ArticleList from "./ArticleList";

interface IProps {
  auth: any // todo
}

function ArticlesRoot(_props: IProps) {
  return (
    <div>
      <Switch>
        <Route path="/members/articles/new" component={ArticleEditor} />
        <Route path="/members/articles/:id/edit" component={ArticleEditor} />
        <Route path="/members/articles" component={ArticleList} exact />
      </Switch>
    </div>
  );
}

export default connect(state => ({
  auth: state.auth,
}))(ArticlesRoot);
