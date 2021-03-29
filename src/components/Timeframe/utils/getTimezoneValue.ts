import { Timezones } from '@keen.io/query';
import { TIMEZONES } from '@keen.io/ui-core';

import { DEFAULT_TIMEZONE } from '../../../modules/query';

export const getTimezoneValue = (timezone?: number | Timezones): Timezones => {
  if (typeof timezone === 'string') return timezone;
  if (typeof timezone === 'number') {
    const namedTimezone = TIMEZONES.find(({ value }) => value === timezone);
    if (namedTimezone) {
      const { name } = namedTimezone;
      return name;
    }
  }

  return DEFAULT_TIMEZONE;
};
