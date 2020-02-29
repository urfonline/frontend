import { ChunkedSlot, Slot, Stream } from '../utils/types';

const LOAD_SCHEDULE_REQUEST = 'LOAD_SCHEDULE_REQUEST';
const LOAD_SCHEDULE_SUCCESS = 'LOAD_SCHEDULE_SUCCESS';
const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';
const UPDATE_CURRENT_SLOT = 'UPDATE_CURRENT_SLOT';
const UPDATE_SLATE_CHUNKS = 'UPDATE_SLATE_CHUNKS';
const SWITCH_ACTIVE_STREAM = 'SWITCH_ACTIVE_STREAM';
const RESOLVE_STREAMS_SUCCESS = 'RESOLVE_STREAMS_SUCCESS';

export const scheduleLoaded = (streams: any) => ({
  type: LOAD_SCHEDULE_SUCCESS,
  payload: { streams: streams.allStreams },
});

export const updateSlot = (slot?: Slot) => ({
  type: UPDATE_CURRENT_SLOT,
  payload: { slot }
});

export const updateSlateChunks = (chunked: Array<Array<ChunkedSlot>>, onAirSlot?: Slot) => ({
  type: UPDATE_SLATE_CHUNKS,
  payload: { slotsByDay: chunked, slot: onAirSlot }
});

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
  streamsResolved: boolean;
  activeStream: number;
  allStreams: Array<Stream>;
  onlineStreams: Array<Stream>;
  slotsByDay: Array<Array<ChunkedSlot>>;
  stream?: Stream;
  onAirSlot?: Slot;
}

const initialState: IScheduleState = {
  isLoading: true,
  streamsResolved: false,
  activeStream: 0,
  allStreams: [],
  onlineStreams: [],
  slotsByDay: [],
  stream: undefined,
};

export default function scheduleReducer(state: IScheduleState = initialState, action: any): IScheduleState {
  switch (action.type) {
    case LOAD_SCHEDULE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_SCHEDULE_SUCCESS: {
      let allStreams = action.payload.streams;

      // to get the initial active stream, we sort by online priority and
      // then find the first stream with a slate. we do this because
      // the rest of the code currently assumes we have a slate.
      let slateStream = Array.from(allStreams).sort(
        (a: any, b: any) => a.priorityOnline - b.priorityOnline
      ).find(
        (stream: any) => stream.slate != null
      );

      let activeStream = allStreams.indexOf(slateStream);
      let stream = allStreams[activeStream];

      return {
        ...state,
        isLoading: false,
        activeStream: activeStream,
        stream: stream,
        allStreams: allStreams,
      };
    }
    case LOAD_SCHEDULE_FAILURE: {
      return {
        ...state,
      };
    }
    case UPDATE_CURRENT_SLOT: {
      return {
        ...state,
        onAirSlot: action.payload.slot,
      };
    }
    case UPDATE_SLATE_CHUNKS: {
      return {
        ...state,
        slotsByDay: action.payload.slotsByDay,
        onAirSlot: action.payload.slot,
      }
    }
    case SWITCH_ACTIVE_STREAM: {
      let streams: any = state.onlineStreams;
      if (streams == null || streams.length == 0) return state;

      let stream = streams[action.payload.streamIndex];

      return {
        ...state,
        activeStream: action.payload.streamIndex,
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
