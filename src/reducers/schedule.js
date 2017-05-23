import {
  LOAD_SCHEDULE_REQUEST,
  LOAD_SCHEDULE_SUCCESS,
  LOAD_SCHEDULE_FAILURE,
  UPDATE_ON_AIR_SLOT,
} from '../actions';
import { chunkSlotsByDay, getOnAirSlot } from '../utils/schedule';

const initialState = {
  isLoading: false,
  data: null,
  chunked: null,
  currentlyOnAir: null,
};

function getOnAirShowAndSlot(payload) {
  const slot = getOnAirSlot(payload.slots);

  return {
    slot,
    show: payload.shows[slot.show],
  };
}

export default function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SCHEDULE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_SCHEDULE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        currentlyOnAir: getOnAirShowAndSlot(action.payload),
        chunked: chunkSlotsByDay(action.payload.slots),
      };
    }
    case LOAD_SCHEDULE_FAILURE: {
      return {
        ...state,
      };
    }
    case UPDATE_ON_AIR_SLOT: {
      return {
        ...state,
        currentlyOnAir: state.data ? getOnAirShowAndSlot(state.data) : null,
      };
    }
    default: {
      return state;
    }
  }
}
