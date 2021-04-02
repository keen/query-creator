import { timezoneSlice } from './reducer';
import {
  getDefaultTimezone,
  getTimezoneSelectionDisabled,
  getTimezonesLoading,
  getTimezones,
  getTimezoneState,
} from './selectors';
import { timezoneSaga } from './timezoneSaga';
import { ReducerState } from './types';
import { fetchTimezones } from './actions';

const timezoneReducer = timezoneSlice.reducer;
const timezoneActions = {
  fetchTimezones,
  ...timezoneSlice.actions,
};

export {
  timezoneSaga,
  timezoneReducer,
  timezoneActions,
  getTimezoneState,
  getDefaultTimezone,
  getTimezonesLoading,
  getTimezoneSelectionDisabled,
  getTimezones,
  ReducerState,
};
