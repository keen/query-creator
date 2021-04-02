import sagaHelper from 'redux-saga-testing';
import { select, put } from 'redux-saga/effects';

import { updateTimeframeOffset } from './updateTimeframeOffset';

import { selectTimezone, setTimeframe } from '../actions';
import { getTimeframe } from '../selectors';

describe('Scenario 1: User modifies timezone for relative timeframe', () => {
  const action = selectTimezone('America/New_York');
  const test = sagaHelper(updateTimeframeOffset(action));

  test('selects query timeframe', (result) => {
    expect(result).toEqual(select(getTimeframe));

    return 'this_14_days';
  });

  test('terminates saga', (result) => {
    expect(result).toBeUndefined();
  });
});

describe('Scenario 2: User modifies timezone for absolute timeframe', () => {
  const action = selectTimezone('America/New_York');
  const test = sagaHelper(updateTimeframeOffset(action));

  test('selects query timeframe', (result) => {
    expect(result).toEqual(select(getTimeframe));

    return {
      start: '2021-04-01T00:00:00+12:00',
      end: '2021-04-02T00:00:00+12:00',
    };
  });

  test('updates offset for absolute timeframe', (result) => {
    const timeframe = {
      start: '2021-04-01T00:00:00-04:00',
      end: '2021-04-02T00:00:00-04:00',
    };

    expect(result).toEqual(put(setTimeframe(timeframe)));
  });

  test('terminates saga', (result) => {
    expect(result).toBeUndefined();
  });
});
