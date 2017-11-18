import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { RootState } from '../../types';

interface IProps {
  auth: any; // todo
}

function ArticleList(_props: IProps) {
  return (
    <div>
      <Helmet title="Articles" />
      <h1 className="Page__heading">Articles</h1>
      <Link to="/members/articles/new">New Article</Link>
      <ul />
    </div>
  );
}

export default connect((state: RootState) => ({
  auth: state.auth,
}))(ArticleList);
