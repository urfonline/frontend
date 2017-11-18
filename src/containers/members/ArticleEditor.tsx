import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../types';

interface IProps {
  auth: any; // todo
}

function ArticleEditor(_props: IProps) {
  return (
    <div>
      <div>article title</div>
      <div>article status</div>
      <div>article publish date</div>
      <div>article image</div>
      <div>article author</div>
      <div>body</div>
    </div>
  );
}

export default connect((state: RootState) => ({
  auth: state.auth,
}))(ArticleEditor);
