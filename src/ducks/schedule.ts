const LOAD_SCHEDULE_REQUEST = 'LOAD_SCHEDULE_REQUEST';
const LOAD_SCHEDULE_SUCCESS = 'LOAD_SCHEDULE_SUCCESS';
const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';
const UPDATE_ON_AIR_SLOT = 'UPDATE_ON_AIR_SLOT';
const SWITCH_ACTIVE_STREAM = 'SWITCH_ACTIVE_STREAM';
const RESOLVE_STREAMS_SUCCESS = 'RESOLVE_STREAMS_SUCCESS';

import { chunkSlotsByDay, getOnAirSlot } from '../utils/schedule';

export const scheduleLoaded = (streams: any) => ({
  type: LOAD_SCHEDULE_SUCCESS,
  payload: { streams: streams.allStreams },
});
export const updateOnAirSlot = () => ({ type: UPDATE_ON_AIR_SLOT });

export const switchStreams = (streamIndex: number) => ({
  type: SWITCH_ACTIVE_STREAM,
  payload: { streamIndex },
});

export const streamsResolved = (onlineStreams: Array<any>) => ({
  type: RESOLVE_STREAMS_SUCCESS,
  payload: { onlineStreams },
});

export interface IScheduleState {
  isLoading: boolean;
  currentlyOnAir: Array<any>;
  slotsByDay: Array<any>;
  automationShow: any;
  streamsResolved: boolean;
  activeStream: number;
  allStreams: Array<any>;
  onlineStreams: Array<any>;
  stream: any;
}

const initialState: IScheduleState = {
  isLoading: true,
  currentlyOnAir: [],
  slotsByDay: [],
  automationShow: null,
  streamsResolved: false,
  activeStream: 0,
  allStreams: [],
  onlineStreams: [],
  stream: null,
};

export default function scheduleReducer(state: IScheduleState = initialState, action: any) {
  switch (action.type) {
    case LOAD_SCHEDULE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_SCHEDULE_SUCCESS: {
      let allStreams = action.payload.streams;
      let stream = allStreams[state.activeStream];

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
        allStreams: allStreams,
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
      let streams: any = state.onlineStreams;
      if (streams == null || streams.length == 0) return state;

      let stream = streams[action.payload.streamIndex];
      if (stream.slate == null) {
        return {
          ...state,
          stream: stream,
          activeStream: action.payload.streamIndex,
        }
        // TODO: the stream has no schedule slate - hide schedule?
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
    case RESOLVE_STREAMS_SUCCESS: {
      return {
        ...state,
        onlineStreams: action.payload.onlineStreams,
        streamsResolved: true,
      }
    }
    default: {
      return state;
    }
  }
}
