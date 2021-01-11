import { ReducerState, AppActions } from './types';

import { SET_QUERY_READINESS } from './constants';

export const initialState: ReducerState = {
  isQueryReady: false,
};

export const appReducer = (
  state: ReducerState = initialState,
  action: AppActions
) => {
  switch (action.type) {
    case SET_QUERY_READINESS:
      return {
        ...state,
        isQueryReady: action.payload.isQueryReady,
      };
    default:
      return state;
  }
};
