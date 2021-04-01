import { AppState } from '../../types';

export const getDefaultTimezone = (state: AppState) =>
  state.timezone.defaultTimezoneForQuery;

export const getTimezoneSelectionDisabled = (state: AppState) =>
  state.timezone.timezoneSelectionDisabled;

export const getTimezonesLoading = (state: AppState) =>
  state.timezone.isLoading;

export const getTimezones = (state: AppState) => state.timezone.timezones;

export const getTimezoneState = (state: AppState) => state.timezone;
