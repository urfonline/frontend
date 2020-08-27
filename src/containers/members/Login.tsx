import React, { useState } from 'react';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import * as authActions from '../../ducks/auth';
import { useMutation } from 'react-apollo-hooks';
import { SubmitInput, TextInput } from '../../components/Form';
import { formToMutation } from '../../utils/forms';

interface IProps {
  loginSuccess(user: any): void;
}

const LoginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        name
        username
        pronouns
        isStaff
        teams {
          name
          slug
          membershipInfo {
            accessLevel
          }
        }
      }
      success
    }
  }
`;

function Login({ loginSuccess }: IProps) {
  const mutate = useMutation(LoginMutation);
  const [error, setError] = useState<String | undefined>();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let variables = formToMutation(e.currentTarget);

    mutate({ variables })
      .then(({ data }) => data.login)
      .then((login) => {
        if (login.success)
          loginSuccess(login.user);
        else
          setError("Could not log you in");
      });
  }

  return <div className="Container">
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <TextInput id="username" title="Username"/>
      <TextInput id="password" title="Password" type="password"/>
      <SubmitInput text="Log In" />
    </form>
    {error && <div className="Error">{error}</div>}
  </div>
}

export default connect(null, {
  loginSuccess: authActions.loginSuccess,
})(Login);
