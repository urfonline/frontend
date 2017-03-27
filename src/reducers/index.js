import { combineReducers } from 'redux';
import shows from './shows';
import player from './shows';
import schedule from './shows';

export default combineReducers({
  shows,
  schedule,
  player,
});
