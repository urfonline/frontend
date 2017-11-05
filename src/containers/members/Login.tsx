import React from 'react';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import * as authActions from '../../ducks/auth';
import {compose} from "recompose";

interface IProps {
  mutate: any,
  loginSuccess: any,
}

interface IState {
  username: string,
  password: string,
  error: string | null,
}

class Login extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null,
    };

    this.handleUsernameUpdate = this.handleUsernameUpdate.bind(this);
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.currentTarget.value });
  }

  handlePasswordUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: e.currentTarget.value });
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props
      .mutate({
        variables: {
          username: this.state.username,
          password: this.state.password,
        },
      })
      .then(({ data }: any) => {
        console.log(data);
        if (data.login.success) {
          this.props.loginSuccess(data.login.token);
        } else {
          this.setState({ error: 'Login failed' });
        }
      });
  }

  render() {
    const { username, password, error } = this.state;

    return (
      <div className="Container">
        {error ? <div>{error}</div> : null}
        <form onSubmit={this.handleSubmit}>
          <label form="loginUsername">Username</label>
          <input
            type="text"
            value={username}
            onChange={this.handleUsernameUpdate}
            id="loginUsername"
          />

          <label form="loginPassword">Password</label>
          <input
            type="password"
            value={password}
            onChange={this.handlePasswordUpdate}
            id="loginPassword"
          />

          <input type="submit" value="Log in" />
        </form>
      </div>
    );
  }
}

const LoginMutation = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      token
      success
    }
  }
`;

export default compose(
  connect(null, {
    loginSuccess: authActions.loginSuccess
  }),
  graphql(LoginMutation),
)(Login);
