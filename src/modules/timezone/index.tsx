import { timezoneSlice } from './reducer';
import { getDefaultTimezone, getTimezoneSelectionDisabled } from './selectors';
import { ReducerState, Timezone } from './types';
import { fetchTimezones } from './actions';

const timezoneReducer = timezoneSlice.reducer;
const timezoneActions = {
  fetchTimezones,
  ...timezoneSlice.actions,
};

export {
  timezoneReducer,
  timezoneActions,
  getDefaultTimezone,
  getTimezoneSelectionDisabled,
  ReducerState,
  Timezone,
};
