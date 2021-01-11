import {
  APP_START,
  SET_QUERY_READINESS,
  STORE_SCHEMAS,
  FETCH_PROJECT_DETAILS,
  FETCH_PROJECT_DETAILS_SUCCESS,
  FETCH_PROJECT_DETAILS_ERROR,
} from './constants';

export type ReducerState = {
  isQueryReady: boolean;
};

export interface AppStartAction {
  type: typeof APP_START;
}

export interface SetQueryReadinessAction {
  type: typeof SET_QUERY_READINESS;
  payload: {
    isQueryReady: boolean;
  };
}

export interface StoreSchemasAction {
  type: typeof STORE_SCHEMAS;
}

export interface FetchProjectDetailsAction {
  type: typeof FETCH_PROJECT_DETAILS;
}

export interface FetchProjectDetailsSuccessAction {
  type: typeof FETCH_PROJECT_DETAILS_SUCCESS;
}

export interface FetchProjectDetailsErrorAction {
  type: typeof FETCH_PROJECT_DETAILS_ERROR;
  payload: {
    error: Error;
  };
}

export type AppActions =
  | AppStartAction
  | StoreSchemasAction
  | SetQueryReadinessAction
  | FetchProjectDetailsAction
  | FetchProjectDetailsSuccessAction
  | FetchProjectDetailsErrorAction;
