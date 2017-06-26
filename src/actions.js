/* FROM V1, need to refactor */
export const LOAD_SCHEDULE_REQUEST = 'LOAD_SCHEDULE_REQUEST';
export const LOAD_SCHEDULE_SUCCESS = 'LOAD_SCHEDULE_SUCCESS';
export const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';

export const PLAYER_CHANGE = 'PLAYER_CHANGE';
export const PLAYER_USER_STATE_CHANGE = 'PLAYER_USER_STATE_CHANGE';
export const INITIATE_PLAY_LIVE = 'INITIATE_PLAY_LIVE';
export const UPDATE_ON_AIR_SLOT = 'UPDATE_ON_AIR_SLOT';

export const loadSchedule = () => dispatch => {
  dispatch({
    type: LOAD_SCHEDULE_REQUEST,
  });

  fetch('/api/schedule')
    .then(data => data.json())
    .then(data => {
      dispatch({
        type: LOAD_SCHEDULE_SUCCESS,
        payload: data,
      });
    })
    .catch(err =>
      dispatch({
        type: LOAD_SCHEDULE_FAILURE,
        error: err,
      })
    );
};
export const scheduleLoaded = schedule => dispatch => {
  dispatch({ type: LOAD_SCHEDULE_SUCCESS, payload: { schedule } });
};

export const playLive = () => ({ type: INITIATE_PLAY_LIVE });
export const updateOnAirSlot = () => ({ type: UPDATE_ON_AIR_SLOT });
export const playerChange = payload => ({ type: PLAYER_CHANGE, payload });

/* OPERATION TECHQUILA, v2 */

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_RESTORE_ATTEMPT = 'LOGIN_RESTORE_ATTEMPT';
export const LOGIN_RESTORE_SUCCESS = 'LOGIN_RESTORE_SUCCESS';

export const loginSuccess = token => ({
  type: LOGIN_SUCCESS,
  payload: { token },
});

export const loginRestoreAttempt = () => dispatch => {
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

export const loginRestoreSuccess = token => ({
  type: LOGIN_RESTORE_SUCCESS,
  payload: { token },
});

export const playerUserStateChange = userState => ({
  type: PLAYER_USER_STATE_CHANGE,
  payload: { userState },
});
