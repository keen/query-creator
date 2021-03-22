import { Timezones } from '@keen.io/query';

export type TimeMode = 'relative' | 'absolute';

export type Timezone = {
  name: Timezones;
  value: number;
  dstValue: number;
};
