const LOAD_SCHEDULE_REQUEST = 'LOAD_SCHEDULE_REQUEST';
const LOAD_SCHEDULE_SUCCESS = 'LOAD_SCHEDULE_SUCCESS';
const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';
const UPDATE_ON_AIR_SLOT = 'UPDATE_ON_AIR_SLOT';
const SWITCH_ACTIVE_STREAM = 'SWITCH_ACTIVE_STREAM';

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

export const switchStreams = (streamIndex: number) => ({
  type: SWITCH_ACTIVE_STREAM,
  payload: { streamIndex }
});

const initialState = {
  isLoading: true,
  data: null,
  chunked: null,
  currentlyOnAir: [],
  slotsByDay: [],
  activeStream: 0,
  onlineStreams: [],
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
      let stream = action.payload.streams[state.activeStream];

      const slotsByDay = chunkSlotsByDay(
        stream.slate.slots,
        stream.slate.automationShow,
      );

      return {
        ...state,
        isLoading: false,
        slotsByDay: slotsByDay,
        automationShow: stream.slate.automationShow,
        currentlyOnAir: getOnAirSlot(slotsByDay),
        stream: stream,
        data: action.payload,
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
        currentlyOnAir: getOnAirSlot(state.slotsByDay),
      };
    }
    case SWITCH_ACTIVE_STREAM: {
      let data: any = state.data;
      if (data == null) return state;

      console.log("hi");

      let stream = data.streams[action.payload.streamIndex];
      if (stream.slate == null) {
        return {
          ...state,
          stream: stream,
          activeStream: action.payload.streamIndex,
        }
      }

      const slotsByDay = chunkSlotsByDay(
        stream.slate.slots,
        stream.slate.automationShow,
      );

      return {
        ...state,
        activeStream: action.payload.streamIndex,
        slotsByDay: slotsByDay,
        automationShow: stream.slate.automationShow,
        currentlyOnAir: getOnAirSlot(slotsByDay),
        stream: stream,
      }
    }
    default: {
      return state;
    }
  }
}
