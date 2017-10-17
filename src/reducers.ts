import { combineReducers } from 'redux';
import auth from './ducks/auth';
import schedule from './ducks/schedule';
import player from './ducks/player';

export default (others: any) =>
  combineReducers({
    auth,
    schedule,
    player,
    ...others,
  });
