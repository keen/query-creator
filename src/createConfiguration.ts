export const createConfiguration = (
  preloadedState,
  defaultTimezoneForQuery,
  disableTimezoneSelection
) => ({
  ...preloadedState,
  query: {
    ...preloadedState.query,
    timezone: defaultTimezoneForQuery,
  },
  timezone: {
    defaultTimezoneForQuery,
    timezoneSelectionDisabled: disableTimezoneSelection,
    timezones: [],
  },
});
