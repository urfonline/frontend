import React from 'react';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { loginSuccess } from '../../actions';

class Login extends React.Component {
  constructor(props) {
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

  handleUsernameUpdate(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordUpdate(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props
      .mutate({
        variables: {
          username: this.state.username,
          password: this.state.password,
        },
      })
      .then(({ data }) => {
        console.log(data);
        if (data.login.success) {
          this.props.dispatch(loginSuccess(data.login.token));
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

export default connect()(graphql(LoginMutation)(Login));
