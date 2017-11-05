import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

interface IProps {
  auth: any // todo
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

export default connect(state => ({
  auth: state.auth,
}))(Dashboard);
