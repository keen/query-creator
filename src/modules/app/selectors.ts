import { AppState } from '../../types';

export const getQueryReadiness = (state: AppState) => state.app.isQueryReady;
