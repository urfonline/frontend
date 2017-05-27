import {
  LOAD_SCHEDULE_REQUEST,
  LOAD_SCHEDULE_SUCCESS,
  LOAD_SCHEDULE_FAILURE,
  UPDATE_ON_AIR_SLOT,
} from '../actions';
import { chunkSlotsByDay, getOnAirSlot } from '../utils/schedule';

const initialState = {
  isLoading: true,
  data: null,
  chunked: null,
  currentlyOnAir: null,
};

export default function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SCHEDULE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_SCHEDULE_SUCCESS: {
      const slotsByDay = chunkSlotsByDay(
        action.payload.schedule.currentSlate.slots,
        action.payload.schedule.automationShow
      );

      return {
        ...state,
        isLoading: false,
        slotsByDay: slotsByDay,
        automationShow: action.payload.schedule.automationShow,
        currentlyOnAir: getOnAirSlot(slotsByDay),
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
