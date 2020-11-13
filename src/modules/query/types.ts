import {
  SERIALIZE_QUERY,
  SET_QUERY,
  SELECT_EVENT_COLLECTION,
  SELECT_ANALYSIS,
  SELECT_TARGET_PROPERTY,
  SET_PERCENTILE,
  SET_TIMEFRAME,
  SET_GROUP_BY,
  SET_ORDER_BY,
  SET_INTERVAL,
  SET_LIMIT,
  SET_EXTRACTION_LIMIT,
  SET_PROPERTY_NAMES,
  SET_FILTERS,
  SELECT_TIMEZONE,
  ADD_FUNNEL_STEP,
  SET_FUNNEL_STEPS,
  SET_FUNNEL_STEP_FILTERS,
  CLONE_FUNNEL_STEP,
  REMOVE_FUNNEL_STEP,
  UPDATE_FUNNEL_STEP,
  SELECT_FUNNEL_STEP_EVENT_COLLECTION,
  CHANGE_FUNNEL_STEPS_ORDER,
  ADD_FUNNEL_STEP_FILTER,
  UPDATE_FUNNEL_STEP_FILTER,
  REMOVE_FUNNEL_STEP_FILTER,
  UPDATE_FUNNEL_STEP_TIMEZONE,
  RESET_EXTRACTION,
  RESET_QUERY,
  ADD_FILTER,
  UPDATE_FILTER,
  REMOVE_FILTER,
} from './constants';

import {
  Timezones,
  Timeframe,
  OrderBy,
  ExtractionProperty,
  FunnelStep,
  Filter,
} from '../../types';
import { Analysis } from '../../types';

export type ReducerState = {
  eventCollection?: string;
  targetProperty?: string;
  percentile?: number;
  timezone?: number | Timezones;
  groupBy?: string | string[];
  orderBy?: OrderBy[];
  limit?: number;
  timeframe?: Timeframe;
  interval?: string;
  analysisType: Analysis;
  filters?: Filter[];
  steps?: FunnelStep[];
  propertyNames?: ExtractionProperty[];
  latest?: number;
};

export type InitialQuery = Omit<ReducerState, 'propertyNames'> & {
  propertyNames?: string | string[];
};

export interface SetQueryAction {
  type: typeof SET_QUERY;
  payload: {
    query: Partial<ReducerState>;
  };
}

export interface SerializeQueryAction {
  type: typeof SERIALIZE_QUERY;
  payload: {
    query: Partial<InitialQuery>;
  };
}

export interface ResetQueryAction {
  type: typeof RESET_QUERY;
}

export interface AddFilterAction {
  type: typeof ADD_FILTER;
  payload: { id: string };
}

export interface RemoveFilterAction {
  type: typeof REMOVE_FILTER;
  payload: { id: string };
}

export interface UpdateFilterAction {
  type: typeof UPDATE_FILTER;
  payload: { id: string; filter: Partial<Filter> };
}

export interface SetExtractionLimitAction {
  type: typeof SET_EXTRACTION_LIMIT;
  payload: {
    limit: number;
  };
}

export interface ResetExtractionAction {
  type: typeof RESET_EXTRACTION;
}

export interface SelectEventCollectionAction {
  type: typeof SELECT_EVENT_COLLECTION;
  payload: {
    name: string;
  };
}

export interface SelectAnalysisAction {
  type: typeof SELECT_ANALYSIS;
  payload: {
    analysis: Analysis;
  };
}

export interface SelectTargetPropertyAction {
  type: typeof SELECT_TARGET_PROPERTY;
  payload: {
    property: string;
  };
}

export interface SelectTimezoneAction {
  type: typeof SELECT_TIMEZONE;
  payload: {
    timezone: Timezones;
  };
}

export interface SetPercentileAction {
  type: typeof SET_PERCENTILE;
  payload: {
    percentile: number;
  };
}

export interface SetPropertyNamesAction {
  type: typeof SET_PROPERTY_NAMES;
  payload: {
    propertyNames: ExtractionProperty[];
  };
}

export interface SetTimeframeAction {
  type: typeof SET_TIMEFRAME;
  payload: {
    timeframe: Timeframe;
  };
}

export interface SetGroupByAction {
  type: typeof SET_GROUP_BY;
  payload: {
    groupBy: string | string[] | undefined;
  };
}

export interface SetIntervalAction {
  type: typeof SET_INTERVAL;
  payload: {
    interval: string | undefined;
  };
}

export interface SetOrderByAction {
  type: typeof SET_ORDER_BY;
  payload: {
    orderBy: OrderBy[] | undefined;
  };
}

export interface SetLimitAction {
  type: typeof SET_LIMIT;
  payload: {
    limit: number | undefined;
  };
}

export interface SetFiltersAction {
  type: typeof SET_FILTERS;
  payload: {
    filters: Filter[];
  };
}

export interface AddFunnelStepAction {
  type: typeof ADD_FUNNEL_STEP;
  payload: {
    id: string;
  };
}

export interface CloneFunnelStepAction {
  type: typeof CLONE_FUNNEL_STEP;
  payload: {
    cloneId: string;
    newId: string;
  };
}

export interface SelectFunnelStepEventCollectionAction {
  type: typeof SELECT_FUNNEL_STEP_EVENT_COLLECTION;
  payload: { name: string };
}

export interface RemoveFunnelStepAction {
  type: typeof REMOVE_FUNNEL_STEP;
  payload: {
    stepId: string;
  };
}

export interface UpdateFunnelStepAction {
  type: typeof UPDATE_FUNNEL_STEP;
  payload: {
    stepId: string;
    properties: Partial<FunnelStep>;
  };
}

export interface ChangeFunnelStepsOrderAction {
  type: typeof CHANGE_FUNNEL_STEPS_ORDER;
  payload: { steps: FunnelStep[] };
}

export interface SetFunnelSteps {
  type: typeof SET_FUNNEL_STEPS;
  payload: { steps: FunnelStep[] };
}

export interface SetFunnelStepFilters {
  type: typeof SET_FUNNEL_STEP_FILTERS;
  payload: { stepId: string; filters: Filter[] };
}

export interface AddFunnelStepFilterAction {
  type: typeof ADD_FUNNEL_STEP_FILTER;
  payload: {
    stepId: string;
    filterId: string;
  };
}

export interface UpdateFunnelStepFilterAction {
  type: typeof UPDATE_FUNNEL_STEP_FILTER;
  payload: {
    stepId: string;
    filterId: string;
    properties: Filter;
  };
}

export interface RemoveFunnelStepFilterAction {
  type: typeof REMOVE_FUNNEL_STEP_FILTER;
  payload: {
    stepId: string;
    filterId: string;
  };
}

export interface UpdateFunnelStepTimezoneAction {
  type: typeof UPDATE_FUNNEL_STEP_TIMEZONE;
  payload: {
    stepId: string;
    timezone: Timezones;
  };
}

export type QueryActions =
  | SerializeQueryAction
  | SetQueryAction
  | ResetQueryAction
  | SelectEventCollectionAction
  | SelectAnalysisAction
  | SelectTargetPropertyAction
  | SetPercentileAction
  | SetGroupByAction
  | SetOrderByAction
  | SetIntervalAction
  | SetLimitAction
  | SetExtractionLimitAction
  | SetPropertyNamesAction
  | SetTimeframeAction
  | SetFiltersAction
  | SelectTimezoneAction
  | SetFunnelSteps
  | SetFunnelStepFilters
  | AddFunnelStepAction
  | UpdateFunnelStepAction
  | RemoveFunnelStepAction
  | SelectFunnelStepEventCollectionAction
  | ChangeFunnelStepsOrderAction
  | CloneFunnelStepAction
  | AddFunnelStepFilterAction
  | UpdateFunnelStepFilterAction
  | RemoveFunnelStepFilterAction
  | UpdateFunnelStepTimezoneAction
  | ResetExtractionAction
  | AddFilterAction
  | RemoveFilterAction
  | UpdateFilterAction;
