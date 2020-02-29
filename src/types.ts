import { IScheduleState } from './ducks/schedule';

export interface ImageResource {
  resource: string;
}

export interface RootState {
  schedule: IScheduleState;
  player: any; // todo
  auth: any; // todo
}
