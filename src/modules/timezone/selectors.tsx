import { AppState } from '../../types';

export const getDefaultTimezone = (state: AppState) =>
  state.timezone.defaultTimezoneForQuery;
export const getTimezoneSelectionDisabled = (state: AppState) =>
  state.timezone.timezoneSelectionDisabled;
