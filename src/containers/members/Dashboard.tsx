import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RootState } from '../../types';

interface IProps {
  auth: any; // todo
}

function Dashboard(_props: IProps) {
  return (
    <div>
      <Helmet title="Dashboard" />
      <h1 className="Page__heading">Dashboard</h1>
      <div>Use the nav above. Dashboard current is rather boring.</div>
    </div>
  );
}

export default connect((state: RootState) => ({
  auth: state.auth,
}))(Dashboard);
