import { Timezone } from '@keen.io/time-utils';

export const timezones: Timezone[] = [
  {
    name: 'Europe/Warsaw',
    utcOffset: '+02:00',
    numberOfSecondsToOffsetTime: 2000,
  },
  {
    name: 'Asia/Anadyr',
    utcOffset: '+12:00',
    numberOfSecondsToOffsetTime: 10800,
  },
  {
    name: 'Asia/Tokyo',
    utcOffset: '+12:00',
    numberOfSecondsToOffsetTime: 10800,
  },
];
