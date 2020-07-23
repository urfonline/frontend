import { Action, ISlateWeek, ISlotList, Slot } from '../utils/types';

// const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';
const UPDATE_CURRENT_SLOT = 'UPDATE_CURRENT_SLOT';
const UPDATE_SLATE_CHUNKS = 'UPDATE_SLATE_CHUNKS';
const SWITCH_ACTIVE_WEEK = 'SWITCH_ACTIVE_WEEK';

export const updateSlot = (slot?: Slot) => ({
  type: UPDATE_CURRENT_SLOT,
  payload: { slot }
});

export const updateSlateChunks = (chunked: ISlateWeek, onAirSlot?: Slot) => ({
  type: UPDATE_SLATE_CHUNKS,
  payload: { slotsByDay: chunked.days, slot: onAirSlot }
});

export const switchWeek = (week?: number) => ({
  type: SWITCH_ACTIVE_WEEK,
  payload: { week },
});

export interface IScheduleState {
  loaded: boolean;

  slotsByDay: Array<ISlotList>;
  onAirSlot?: Slot;

  selectedWeek: number;
}

const initialState: IScheduleState = {
  loaded: false,
  slotsByDay: [],
  selectedWeek: 1,
};

export default function scheduleReducer(state: IScheduleState = initialState, action: Action): IScheduleState {
  switch (action.type) {
    case UPDATE_CURRENT_SLOT: {
      return {
        ...state,
        onAirSlot: action.payload.slot,
      };
    }

    case UPDATE_SLATE_CHUNKS: {
      return {
        ...state,
        loaded: true,
        slotsByDay: action.payload.slotsByDay,
        onAirSlot: action.payload.slot,
      }
    }

    case SWITCH_ACTIVE_WEEK: {
      return {
        ...state,
        selectedWeek: action.payload.week,
      }
    }

    default: {
      return state;
    }
  }
}
