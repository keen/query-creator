import { ReducerState as QueryReducerState } from './modules/query';
import { ReducerState as EventsReducerState } from './modules/events';
import { ReducerState as ChartSettingsReducerState } from './modules/chartSettings';

export type Analysis =
  | 'sum'
  | 'average'
  | 'count'
  | 'count_unique'
  | 'maximum'
  | 'minimum'
  | 'median'
  | 'percentile'
  | 'standard_deviation'
  | 'funnel'
  | 'extraction'
  | 'select_unique';

export type AppState = {
  query: QueryReducerState;
  events: EventsReducerState;
  chartSettings: ChartSettingsReducerState;
};

export type CreatorFields =
  | 'analysisType'
  | 'eventCollection'
  | 'targetProperty'
  | 'percentile'
  | 'timeframe'
  | 'timezone'
  | 'interval'
  | 'groupBy'
  | 'orderBy'
  | 'limit'
  | 'steps'
  | 'propertyNames'
  | 'latest'
  | 'email'
  | 'contentEncoding'
  | 'filters';

type FieldRule = ('*' | Analysis)[];

export type QueryCreatorConfig = Record<CreatorFields, FieldRule>;

export type OrderBy = {
  id?: string;
  propertyName: string;
  direction: 'ASC' | 'DESC';
};

export type ExtractionProperty = {
  id: string;
  propertyName: string;
};

export type Timeframe =
  | string
  | {
      start: string;
      end: string;
    };

export type Property =
  | 'String'
  | 'Number'
  | 'Datetime'
  | 'List'
  | 'Geo'
  | 'Boolean';

export type Coordinates = {
  coordinates: [number, number];
  maxDistanceMiles: number;
};

export type Operator =
  | 'or'
  | 'eq'
  | 'ne'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'exists'
  | 'in'
  | 'contains'
  | 'not_contains'
  | 'within'
  | 'regex'
  | 'is_null'
  | 'is_not_null';

export type Filter = {
  id?: string;
  propertyName: string;
  operator: Operator;
  propertyValue: any;
  propertyType?: Property;
};

export type FunnelStep = {
  id?: string;
  actorProperty: string;
  eventCollection: string;
  inverted: boolean;
  optional: boolean;
  timeframe: Timeframe;
  timezone?: Timezones | number;
  withActors: boolean;
  filters: Filter[];
  stepLabel?: string;
};

export type Timezones =
  | 'US/Eastern'
  | 'US/Central'
  | 'US/Mountain'
  | 'US/Pacific'
  | 'US/Alaska'
  | 'US/Hawaii'
  | 'Europe/Amsterdam'
  | 'Europe/London'
  | 'Europe/Paris'
  | 'Europe/Prague'
  | 'Europe/Stockholm'
  | 'Europe/Copenhagen'
  | 'Africa/Casablanca'
  | 'Africa/Nairobi'
  | 'Asia/Singapore'
  | 'Australia/Sydney'
  | 'Asia/Dubai'
  | 'Asia/Istanbul'
  | 'Asia/Jakarta'
  | 'Asia/Tokyo'
  | 'America/Sao_Paulo'
  | 'Australia/Perth'
  | 'Europe/Istanbul'
  | 'Pacific/Auckland'
  | 'UTC';

export type TabTypes = 'default' | 'large';

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};
