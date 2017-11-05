import React from 'react';
import { connect } from 'react-redux';
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";

interface IProps {
  auth: any // todo
}

function ArticleList(_props: IProps) {
  return (
    <div>
      <Helmet title="Articles" />
      <h1 className="Page__heading">Articles</h1>
      <Link to="/members/articles/new">New Article</Link>
      <ul>

      </ul>
    </div>
  );
}

export default connect(state => ({
  auth: state.auth,
}))(ArticleList);
