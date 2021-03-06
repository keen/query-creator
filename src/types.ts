import { Timeframe } from '@keen.io/query';

import { ReducerState as AppReducerState } from './modules/app';
import { ReducerState as QueryReducerState } from './modules/query';
import { ReducerState as EventsReducerState } from './modules/events';
import { ReducerState as ChartSettingsReducerState } from './modules/chartSettings';
import { ReducerState as TimezoneReducerState } from './modules/timezone';

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
  app: AppReducerState;
  query: QueryReducerState;
  events: EventsReducerState;
  chartSettings: ChartSettingsReducerState;
  timezone: TimezoneReducerState;
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
  timezone?: string | number;
  withActors: boolean;
  filters: Filter[];
  stepLabel?: string;
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};
