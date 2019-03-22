const LOAD_SCHEDULE_REQUEST = 'LOAD_SCHEDULE_REQUEST';
const LOAD_SCHEDULE_SUCCESS = 'LOAD_SCHEDULE_SUCCESS';
const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';
const UPDATE_ON_AIR_SLOT = 'UPDATE_ON_AIR_SLOT';

import { chunkSlotsByDay, getOnAirSlot } from '../utils/schedule';

export const loadSchedule = () => (dispatch: any) => {
  dispatch({
    type: LOAD_SCHEDULE_REQUEST,
  });

  fetch('/api/schedule')
    .then((data) => data.json())
    .then((data) => {
      dispatch({
        type: LOAD_SCHEDULE_SUCCESS,
        payload: data,
      });
    })
    .catch((err) =>
      dispatch({
        type: LOAD_SCHEDULE_FAILURE,
        error: err,
      }),
    );
};
export const scheduleLoaded = (streams: any) => ({
  type: LOAD_SCHEDULE_SUCCESS,
  payload: { streams: streams.allStreams },
});
export const updateOnAirSlot = () => ({ type: UPDATE_ON_AIR_SLOT });

const initialState = {
  isLoading: true,
  data: null,
  chunked: null,
  currentlyOnAir: [],
  slotsByDay: [],
  activeStream: 0,
};

export default function scheduleReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOAD_SCHEDULE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_SCHEDULE_SUCCESS: {
      console.log(action);
      const slotsByDay = action.payload.streams.map((stream: any) => stream.slate ? chunkSlotsByDay(
        stream.slate.slots,
        stream.slate.automationShow,
      ) : null);

      return {
        ...state,
        isLoading: false,
        slotsByDay: slotsByDay,
        automationShow: action.payload.streams.map((stream: any) => stream.slate ? stream.slate.automationShow : null),
        currentlyOnAir: slotsByDay.map(getOnAirSlot),
      };
    }
    case LOAD_SCHEDULE_FAILURE: {
      return {
        ...state,
      };
    }
    case UPDATE_ON_AIR_SLOT: {
      if (state.isLoading) {
        return state;
      }

      return {
        ...state,
        currentlyOnAir: state.slotsByDay.map(getOnAirSlot),
      };
    }
    default: {
      return state;
    }
  }
}
