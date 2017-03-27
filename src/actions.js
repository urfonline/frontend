export const LOAD_SCHEDULE_REQUEST = 'LOAD_SCHEDULE_REQUEST';
export const LOAD_SCHEDULE_SUCCESS = 'LOAD_SCHEDULE_SUCCESS';
export const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';

export const PLAYER_CHANGE = 'PLAYER_CHANGE';
export const INITIATE_PLAY_LIVE = 'INITIATE_PLAY_LIVE';
export const UPDATE_ON_AIR_SLOT = 'UPDATE_ON_AIR_SLOT';

export const loadSchedule = () => (dispatch) => {
  dispatch({
    type: LOAD_SCHEDULE_REQUEST,
  });

  fetch('/api/schedule')
    .then(data => data.json())
    .then((data) => {
      dispatch({
        type: LOAD_SCHEDULE_SUCCESS,
        payload: data,
      });
    })
    .catch(err => dispatch({
      type: LOAD_SCHEDULE_FAILURE,
      error: err,
    }));
};

export const playLive = () => ({ type: INITIATE_PLAY_LIVE });
export const updateOnAirSlot = () => ({ type: UPDATE_ON_AIR_SLOT });
export const playerChange = payload => ({ type: PLAYER_CHANGE, payload });
