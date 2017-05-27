import { LOGIN_RESTORE_SUCCESS, LOGIN_SUCCESS } from '../actions';

const initialState = {
  token: null,
  user: null,
};

export default function authReducer(state = initialState, { type, payload }) {
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
