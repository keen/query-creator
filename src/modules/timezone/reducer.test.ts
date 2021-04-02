import { initialState, timezoneSlice } from './reducer';

import { timezones as timezonesCollection } from './fixtures';

test('set default timezone used for new created queries', () => {
  const action = timezoneSlice.actions.setDefaultTimezone('America/New_York');
  const { defaultTimezoneForQuery } = timezoneSlice.reducer(
    initialState,
    action
  );

  expect(defaultTimezoneForQuery).toEqual('America/New_York');
});

test('set timezone selection settings', () => {
  const action = timezoneSlice.actions.setTimezoneSelectionDisabled(true);
  const { timezoneSelectionDisabled } = timezoneSlice.reducer(
    initialState,
    action
  );

  expect(timezoneSelectionDisabled).toEqual(true);
});

test('set timezones loading state', () => {
  const action = timezoneSlice.actions.setTimezonesLoading(true);
  const { isLoading } = timezoneSlice.reducer(initialState, action);

  expect(isLoading).toEqual(true);
});

test('set error state', () => {
  const action = timezoneSlice.actions.setError(true);
  const { error } = timezoneSlice.reducer(initialState, action);

  expect(error).toEqual(true);
});

test('set timezones', () => {
  const action = timezoneSlice.actions.setTimezones(timezonesCollection);
  const { isLoading, timezones } = timezoneSlice.reducer(
    { isLoading: true, ...initialState },
    action
  );

  expect(isLoading).toEqual(false);
  expect(timezones).toEqual(timezonesCollection);
});
