import { combineReducers } from 'redux';
import auth from './auth';
import shows from './shows';
import player from './player';
import schedule from './schedule';

export default others =>
  combineReducers({
    auth,
    shows,
    schedule,
    player,
    ...others,
  });
