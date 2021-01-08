import { Analysis } from './types';

export const SELECT_EVENT_COLLECTION = '@query-creator/SELECT_EVENT_COLLECTION';
export const SELECT_ANALYSIS = '@query-creator/SELECT_ANALYSIS';

export const SET_QUERY_EVENT = '@query-creator/set-query';
export const NEW_QUERY_EVENT = '@query-creator/new-query';

export const SET_CHART_SETTINGS = '@query-creator/set-chart-settings';
export const UPDATE_VISUALIZATION_TYPE =
  '@query-creator/UPDATE_VISUALIZATION_TYPE';

export const DEFAULT_ANALYSIS = 'count';

export const UPDATE_TIMEOUT = 0;
export const QUERY_UPDATE_ACTION = '@query';

export const KEYBOARD_KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESCAPE: 27,
};

export const SCHEMA_PROPS = {
  num: 'Number',
  string: 'String',
  bool: 'Boolean',
  datetime: 'Datetime',
  null: 'String',
  list: 'List',
  geo: 'Geo',
  array: 'List',
};

export const ABSTRACT_OPERATORS = ['is_null', 'is_not_null'];

export const ANALYSIS_TYPES: Analysis[] = [
  'average',
  'count',
  'count_unique',
  'extraction',
  'funnel',
  'maximum',
  'median',
  'minimum',
  'percentile',
  'select_unique',
  'standard_deviation',
  'sum',
];

export const TIME_UNITS = {
  minute: 'minutes',
  hour: 'hours',
  day: 'days',
  week: 'weeks',
  month: 'months',
  year: 'years',
};

export const TOOLTIP_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
