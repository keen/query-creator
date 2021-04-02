import { select, put } from 'redux-saga/effects';
import { setTimezoneOffset } from '@keen.io/time-utils';

import { setTimeframe, selectTimezone } from '../actions';
import { getTimeframe } from '../selectors';

/**
 * Udaptes query absolute timeframe according to timezone offset
 * @param timeframe - query timeframe
 * @return void
 *
 */
export function* updateTimeframeOffset({
  payload,
}: ReturnType<typeof selectTimezone>) {
  const { timezone } = payload;
  const timeframe = yield select(getTimeframe);

  if (typeof timeframe !== 'string') {
    const { start, end } = timeframe;
    const timeWithZone = {
      start: setTimezoneOffset(start, timezone),
      end: setTimezoneOffset(end, timezone),
    };
    yield put(setTimeframe(timeWithZone));
  }
}
