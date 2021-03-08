import { FunnelStep } from '../../types';

export const SET_QUERY = '@query/SET_QUERY';
export const SERIALIZE_QUERY = '@query/SERIALIZE_QUERY';
export const POST_PROCESSING_FINISHED = '@query/POST_PROCESSING_FINISHED';
export const RESET_QUERY = '@query/RESET_QUERY';
export const SELECT_EVENT_COLLECTION = '@query/SELECT_EVENT_COLLECTION';
export const SELECT_ANALYSIS = '@query/SELECT_ANALYSIS';
export const SELECT_TARGET_PROPERTY = '@query/SELECT_TARGET_PROPERTY';
export const SET_PERCENTILE = '@query/SET_PERCENTILE';
export const SET_TIMEFRAME = '@query/SET_TIMEFRAME';
export const SET_GROUP_BY = '@query/SET_GROUP_BY';
export const SET_INTERVAL = '@query/SET_INTERVAL';
export const SET_ORDER_BY = '@query/SET_ORDER_BY';
export const SET_LIMIT = '@query/SET_LIMIT';
export const RESET_EXTRACTION = '@query/RESET_EXTRACTION';
export const SET_EXTRACTION_LIMIT = '@query/SET_EXTRACTION_LIMIT';
export const SET_PROPERTY_NAMES = '@query/SET_PROPERTY_NAMES';
export const SET_FILTERS = '@query/SET_FILTERS';
export const SELECT_TIMEZONE = '@query/SELECT_TIMEZONE';
export const ADD_FUNNEL_STEP = '@query/ADD_FUNNEL_STEP';
export const SELECT_FUNNEL_STEP_EVENT_COLLECTION =
  '@query/SELECT_FUNNEL_STEP_EVENT_COLLECTION';
export const REMOVE_FUNNEL_STEP = '@query/REMOVE_FUNNEL_STEP';
export const UPDATE_FUNNEL_STEP = '@query/UPDATE_FUNNEL_STEP';
export const CLONE_FUNNEL_STEP = '@query/CLONE_FUNNEL_STEP';
export const SET_FUNNEL_STEPS = '@query/SET_FUNNEL_STEPS';
export const SET_FUNNEL_STEP_FILTERS = '@query/SET_FUNNEL_STEP_FILTERS';
export const CHANGE_FUNNEL_STEPS_ORDER = '@query/CHANGE_FUNNEL_STEP_ORDER';
export const ADD_FUNNEL_STEP_FILTER = '@query/ADD_FUNNEL_STEP_FILTER';
export const UPDATE_FUNNEL_STEP_FILTER = '@query/UPDATE_FUNNEL_STEP_FILTER';
export const REMOVE_FUNNEL_STEP_FILTER = '@query/REMOVE_FUNNEL_STEP_FILTER';
export const UPDATE_FUNNEL_STEP_TIMEZONE = '@query/UPDATE_FUNNEL_STEP_TIMEZONE';
export const ADD_FILTER = '@query/ADD_FILTER';
export const UPDATE_FILTER = '@query/UPDATE_FILTER';
export const REMOVE_FILTER = '@query/REMOVE_FILTER';

export const DEFAULT_ANALYSIS = 'count';
export const DEFAULT_TIMEFRAME = 'this_14_days';
export const DEFAULT_TIMEZONE = 'UTC';
export const DEFAULT_EXTRACTION_LIMIT = 100;

export const DEFAULT_FILTER = {
  propertyName: undefined,
  operator: undefined,
  propertyValue: undefined,
  propertyType: undefined,
};

export const DEFAULT_FUNNEL_STEP: FunnelStep = {
  eventCollection: undefined,
  actorProperty: undefined,
  timeframe: DEFAULT_TIMEFRAME,
  timezone: DEFAULT_TIMEZONE,
  filters: [],
  inverted: false,
  optional: false,
  withActors: false,
};
