/* eslint-disable @typescript-eslint/camelcase */
import { takeLatest, put, delay } from 'redux-saga/effects';

import { fetchTimezones } from './actions';
import { timezoneSlice } from './reducer';

/**
 * Fetch collection of timezones from API
 * @return void
 *
 */
function* fetchTimezonesHandler() {
  try {
    yield put(timezoneSlice.actions.setTimezonesLoading(true));
    //
    // const timezonesResponse = yield fetch('https://staging-api.keen.io/timezones');
    //
    // console.log(timezonesResponse, 'sa');

    yield delay(6000);

    const mock = [
      {
        name: 'Pacific/Apia',
        utc_offset: '+14:00',
        number_of_seconds_to_offset_time: 12,
      },
      {
        name: 'Pacific/Kiritimati',
        utc_offset: '+14:00',
        number_of_seconds_to_offset_time: 10800,
      },
      {
        name: 'Etc/GMT-14',
        utc_offset: '+14:00',
        number_of_seconds_to_offset_time: 10800,
      },
      {
        name: 'Europe/Warsaw',
        utc_offset: '+02:00',
        number_of_seconds_to_offset_time: 10800,
      },
      {
        name: 'Asia/Anadyr',
        utc_offset: '+12:00',
        number_of_seconds_to_offset_time: 10800,
      },
    ];

    const mockResponse = mock.map((timezone) => ({
      name: timezone.name,
      numberOfSecondsToOffsetTime: timezone.number_of_seconds_to_offset_time,
      utcOffset: timezone.utc_offset,
    }));

    yield put(timezoneSlice.actions.setTimezones(mockResponse));
  } catch (err) {
    yield put(timezoneSlice.actions.setError(true));
    yield put(timezoneSlice.actions.setTimezonesLoading(false));
  }
}

export function* timezoneSaga() {
  yield takeLatest(fetchTimezones.type, fetchTimezonesHandler);
}
