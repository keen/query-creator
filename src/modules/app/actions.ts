import {
  APP_START,
  STORE_SCHEMAS,
  SET_QUERY_READINESS,
  FETCH_PROJECT_DETAILS,
  FETCH_PROJECT_DETAILS_SUCCESS,
  FETCH_PROJECT_DETAILS_ERROR,
} from './constants';

import { AppActions } from './types';

export const appStart = (): AppActions => ({
  type: APP_START,
});

export const storeSchemas = (): AppActions => ({
  type: STORE_SCHEMAS,
});

export const setQueryReadiness = (isQueryReady: boolean): AppActions => ({
  type: SET_QUERY_READINESS,
  payload: {
    isQueryReady,
  },
});

export const fetchProjectDetails = (): AppActions => ({
  type: FETCH_PROJECT_DETAILS,
});

export const fetchProjectDetailsSuccess = (): AppActions => ({
  type: FETCH_PROJECT_DETAILS_SUCCESS,
});

export const fetchProjectDetailsError = (error: Error): AppActions => ({
  type: FETCH_PROJECT_DETAILS_ERROR,
  payload: { error },
});
