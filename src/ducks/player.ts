export const PLAYER_CHANGE = 'PLAYER_CHANGE';
export const PLAYER_USER_STATE_CHANGE = 'PLAYER_USER_STATE_CHANGE';
export const PLAYER_AUDIO_STATE_CHANGE = 'PLAYER_AUDIO_STATE_CHANGE';
export const INITIATE_PLAY_LIVE = 'INITIATE_PLAY_LIVE';

export const playLive = () => ({ type: INITIATE_PLAY_LIVE });
export const playerChange = (payload: any) => ({
  type: PLAYER_CHANGE,
  payload,
});

/* OPERATION TECHQUILA, v2 */

export const playerUserStateChange = (userState: any) => ({
  type: PLAYER_USER_STATE_CHANGE,
  payload: { userState },
});

export const playerAudioStateChange = (playerState: any) => ({
  type: PLAYER_AUDIO_STATE_CHANGE,
  payload: { playerState },
});

const initialState = {
  stream: 'live',
  playerState: null,
  userState: false,
  audioSourceType: null,
};

export default function playerReducer(state = initialState, action: any) {
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
        playerState: ''
      };
    }
    case PLAYER_AUDIO_STATE_CHANGE: {
      return {
        ...state,
        playerState: action.payload.playerState.type,
      };
    }
    default: {
      return state;
    }
  }
}
