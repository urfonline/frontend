import {
  INITIATE_PLAY_LIVE,
  PLAYER_CHANGE,
  PLAYER_USER_STATE_CHANGE,
} from '../actions';

const initialState = {
  stream: 'live',
  playerState: null,
  userState: false,
  audioSourceType: null,
};

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_PLAY_LIVE: {
      return {
        ...state,
        stream: 'live',
        userState: 'PLAY',
      };
    }
    case PLAYER_CHANGE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case PLAYER_USER_STATE_CHANGE: {
      return {
        ...state,
        userState: action.payload.userState,
      };
    }
    default: {
      return state;
    }
  }
}
