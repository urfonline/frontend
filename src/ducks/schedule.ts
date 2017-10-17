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
    .then(data => data.json())
    .then(data => {
      dispatch({
        type: LOAD_SCHEDULE_SUCCESS,
        payload: data,
      });
    })
    .catch(err =>
      dispatch({
        type: LOAD_SCHEDULE_FAILURE,
        error: err,
      })
    );
};
export const scheduleLoaded = (schedule: any) => ({ type: LOAD_SCHEDULE_SUCCESS, payload: { schedule } });
export const updateOnAirSlot = () => ({ type: UPDATE_ON_AIR_SLOT });

const initialState = {
  isLoading: true,
  data: null,
  chunked: null,
  currentlyOnAir: null,
  slotsByDay: null,
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
        currentlyOnAir: state.data ? getOnAirSlot(state.slotsByDay) : null,
      };
    }
    default: {
      return state;
    }
  }
}
