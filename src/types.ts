import { IScheduleState } from './ducks/schedule';
import { IStreamState } from './ducks/streams';

export interface ImageResource {
  resource: string;
}

export interface RootState {
  schedule: IScheduleState;
  streams: IStreamState;
  player: any; // todo
  auth: any; // todo
}
