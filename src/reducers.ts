import { combineReducers } from 'redux';
import auth from './ducks/auth';
import schedule from './ducks/schedule';
import player from './ducks/player';

export default () =>
  combineReducers({
    auth,
    schedule,
    player,
  });
