import { combineReducers } from 'redux';

import { appReducer } from './modules/app';
import { queryReducer } from './modules/query';
import { eventsReducer } from './modules/events';
import { chartSettingsReducer } from './modules/chartSettings';

export default combineReducers({
  app: appReducer,
  query: queryReducer,
  events: eventsReducer,
  chartSettings: chartSettingsReducer,
  lastAction: (_state, action) => action,
});
