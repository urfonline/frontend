const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_RESTORE_ATTEMPT = 'LOGIN_RESTORE_ATTEMPT';
const LOGIN_RESTORE_SUCCESS = 'LOGIN_RESTORE_SUCCESS';

export const loginSuccess = (token: string) => ({
  type: LOGIN_SUCCESS,
  payload: { token },
});

export const loginRestoreAttempt = () => (dispatch: any) => {
  dispatch({
    type: LOGIN_RESTORE_ATTEMPT,
    payload: {},
  });

  // get data, if token alive:
  const token = localStorage.getItem('token');
  if (token) {
    dispatch(loginRestoreSuccess(token));
  }
};

export const loginRestoreSuccess = (token: string) => ({
  type: LOGIN_RESTORE_SUCCESS,
  payload: { token },
});

const initialState = {
  token: null,
  user: null,
};

export default function authReducer(state = initialState, { type, payload }: { type: string, payload: any }) {
  switch (type) {
    case LOGIN_SUCCESS: {
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        token: payload.token,
      };
    }
    case LOGIN_RESTORE_SUCCESS: {
      return {
        ...state,
        token: payload.token,
        user: payload.user,
      };
    }
    default: {
      return state;
    }
  }
}
