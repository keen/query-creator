import { getTimezoneValue } from './getTimezoneValue';

import { timezones } from '../../../modules/timezone/fixtures';

test('matches timezone offset with first named timezone', () => {
  const timezone = 10800;

  expect(
    getTimezoneValue({
      timezone,
      timezones,
      isLoading: false,
      defaultTimezone: 'UTC',
    })
  ).toEqual('Asia/Anadyr');
});

test('returns "null" when timezones are in loading state and numeric offset is provided ', () => {
  const timezone = 1200;

  expect(
    getTimezoneValue({
      timezone,
      timezones,
      isLoading: true,
      defaultTimezone: 'UTC',
    })
  ).toBeNull();
});

test('returns timezone name', () => {
  const timezone = 'Europe/London';

  expect(
    getTimezoneValue({
      timezone,
      timezones,
      isLoading: false,
      defaultTimezone: 'UTC',
    })
  ).toEqual(timezone);
});

test('fallbacks to default timezone', () => {
  const timezone = -1200;

  expect(
    getTimezoneValue({
      timezone,
      timezones,
      isLoading: false,
      defaultTimezone: 'UTC',
    })
  ).toEqual('UTC');
});
