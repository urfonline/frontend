import { INITIATE_PLAY_LIVE, PLAYER_CHANGE } from '../actions';

const initialState = {
  stream: null,
};

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_PLAY_LIVE: {
      return {
        ...state,
        stream: 'live',
      };
    }
    case PLAYER_CHANGE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
