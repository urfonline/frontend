import { Action, Stream } from '../utils/types';

const LOAD_STREAMS_SUCCESS = 'LOAD_STREAMS_SUCCESS';
const SWITCH_ACTIVE_STREAM = 'SWITCH_ACTIVE_STREAM';
const RESOLVE_STREAMS_SUCCESS = 'RESOLVE_STREAMS_SUCCESS';

export const streamsLoaded = (streams: any) => ({
  type: LOAD_STREAMS_SUCCESS,
  payload: { streams: streams.allStreams },
});

export const switchStreams = (streamIndex: number) => ({
  type: SWITCH_ACTIVE_STREAM,
  payload: { streamIndex },
});

export const streamsResolved = (onlineStreams: Array<any>) => ({
  type: RESOLVE_STREAMS_SUCCESS,
  payload: { onlineStreams },
});

export interface IStreamState {
  loaded: boolean;
  activeStream: number;
  allStreams: Array<Stream>;
  stream?: Stream;

  onlineResolved: boolean;
  onlineStreams: Array<Stream>;
}

const initialState: IStreamState = {
  loaded: false,
  activeStream: 0,
  allStreams: [],

  onlineResolved: false,
  onlineStreams: [],
};

export default function streamReducer(state: IStreamState = initialState, action: Action): IStreamState {
  switch (action.type) {
    case LOAD_STREAMS_SUCCESS: {
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
        loaded: true,
        activeStream: activeStream,
        stream: stream,
        allStreams: allStreams,
      };
    }

    case SWITCH_ACTIVE_STREAM: {
      let streams = state.onlineStreams;
      if (streams == null || streams.length == 0) return state;

      let stream = streams[action.payload.streamIndex];

      return {
        ...state,
        activeStream: action.payload.streamIndex,
        stream: stream,
      };
    }

    case RESOLVE_STREAMS_SUCCESS: {
      return {
        ...state,
        onlineStreams: action.payload.onlineStreams,
        onlineResolved: true,
      }
    }

    default: {
      return state;
    }
  }
}
