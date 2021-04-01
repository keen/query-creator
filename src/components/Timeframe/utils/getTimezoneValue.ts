import { Timezone } from '@keen.io/time-utils';

type Options = {
  timezone?: number | string;
  isLoading: boolean;
  timezones: Timezone[];
  defaultTimezone: string;
};

/**
 * Get timezone value based on provided type
 * @param timezone - named timezone or offset
 * @param timezones - collection of timezones
 * @param defaultTimezone - default timezone
 * @param isLoading - timezones loading indicator
 * @return named timezone
 *
 */
export const getTimezoneValue = ({
  timezone,
  timezones,
  isLoading,
  defaultTimezone,
}: Options) => {
  if (isLoading) return null;
  if (typeof timezone === 'string') return timezone;
  if (typeof timezone === 'number') {
    const namedTimezone = timezones.find(
      ({ numberOfSecondsToOffsetTime }) =>
        numberOfSecondsToOffsetTime === timezone
    );
    if (namedTimezone) {
      const { name } = namedTimezone;
      return name;
    }
  }

  return defaultTimezone;
};
