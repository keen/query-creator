import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, Store, Unsubscribe } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { ThemeProvider } from 'styled-components';
import { getPubSub, PubSub } from '@keen.io/pubsub';
import { screenBreakpoints } from '@keen.io/ui-core';
import KeenAnalysis from 'keen-analysis';

import App from './App';
import { GlobalStyles } from './components';
import rootSaga from './saga';
import rootReducer from './reducer';
import { rehydrateState } from './rehydrateState';
import { AppContext } from './contexts';

import { appStart, getQueryReadiness } from './modules/app';
import { getQuery, serializeQuery, resetQuery } from './modules/query';
import { updateChartSettings } from './modules/chartSettings';
import { transformToQuery, transformQueryToCamelCase } from './utils';

import {
  UPDATE_TIMEOUT,
  SET_QUERY_EVENT,
  NEW_QUERY_EVENT,
  SET_CHART_SETTINGS,
  UPDATE_VISUALIZATION_TYPE,
  QUERY_UPDATE_ACTION,
  ANALYTICS_API_HOST,
  TIMEZONES_API_HOST,
  HTTP_PROTOCOL,
} from './constants';
import { createConfiguration } from './createConfiguration';

declare global {
  interface Window {
    __QUERY_CREATOR_SCHEMAS__: Record<string, any>;
  }
}

type Props = {
  /** Keen project identifer */
  projectId: string;
  /** Keen read access key */
  readKey: string;
  /** Keen master access key */
  masterKey: string;
  /** Modal container selector */
  modalContainer: string;
  /** Update query event handler */
  onUpdateQuery?: (query: Record<string, any>, isQueryReady: boolean) => void;
  /** Update chart settings handler */
  onUpdateChartSettings: (chartSettings: Record<string, any>) => void;
  /** Host name */
  host?: string;
  /** Timezones host */
  timezonesHost?: string;
  /** Default timezone for query */
  defaultTimezoneForQuery?: string;
  /** Disable timezone selection flag */
  disableTimezoneSelection?: boolean;
  /** Disable filter suggestions */
  disableFilterSuggestions?: boolean;
  /** Type of http protocol to use */
  httpProtocol: 'http' | 'https';
};

class QueryCreator extends React.PureComponent<Props> {
  /** Query Creator store */
  store: Store;

  pubsub: PubSub;

  /** Event loop update query tick */
  updateQueryTrigger: any;

  setQuerySubscription: () => void;

  storeSubscription: Unsubscribe;

  keenClient: any;

  constructor(props: Props) {
    super(props);

    this.keenClient = new KeenAnalysis({
      projectId: this.props.projectId,
      masterKey: this.props.masterKey,
      readKey: this.props.readKey,
      host: this.props.host,
      protocol: this.props.httpProtocol,
    });

    const sagaMiddleware = createSagaMiddleware({
      context: {
        [HTTP_PROTOCOL]: this.props.httpProtocol,
        keenClient: this.keenClient,
        [ANALYTICS_API_HOST]: this.props.host,
        [TIMEZONES_API_HOST]: this.props.timezonesHost,
      },
    });

    const preloadedState = rehydrateState();
    const initialState = createConfiguration(
      preloadedState,
      this.props.defaultTimezoneForQuery,
      !!this.props.disableTimezoneSelection
    );

    this.store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(sagaMiddleware)
    );

    sagaMiddleware.run(rootSaga);

    this.store.dispatch(appStart());

    this.pubsub = getPubSub();

    this.runQueryListener();
    this.subscribeSetQuery();
  }

  componentWillUnmount() {
    if (this.storeSubscription) this.storeSubscription();
    if (this.setQuerySubscription) this.setQuerySubscription();
  }

  runQueryListener = () => {
    const { onUpdateQuery } = this.props;
    this.storeSubscription = this.store.subscribe(() => {
      const state = this.store.getState();

      const isQueryReady = getQueryReadiness(state);
      const query = getQuery(state);

      if (
        onUpdateQuery &&
        state.lastAction.type.includes(QUERY_UPDATE_ACTION)
      ) {
        if (this.updateQueryTrigger) clearTimeout(this.updateQueryTrigger);

        this.updateQueryTrigger = setTimeout(() => {
          onUpdateQuery(transformToQuery(query), isQueryReady);
        }, UPDATE_TIMEOUT);
      }
    });
  };

  subscribeSetQuery = () => {
    this.setQuerySubscription = this.pubsub.subscribe(
      (eventName: string, meta: any) => {
        switch (eventName) {
          case NEW_QUERY_EVENT:
            const {
              timezone: { defaultTimezoneForQuery },
            } = this.store.getState();
            this.store.dispatch(resetQuery(defaultTimezoneForQuery));
            break;
          case SET_QUERY_EVENT:
            const { query } = meta;
            const transformedQuery = transformQueryToCamelCase(query);
            this.store.dispatch(serializeQuery(transformedQuery));
            break;
          case SET_CHART_SETTINGS:
            const { chartSettings } = meta;
            this.store.dispatch(updateChartSettings(chartSettings));
            break;
          case UPDATE_VISUALIZATION_TYPE:
            const { chartSettings: settings } = this.store.getState();
            this.props.onUpdateChartSettings(settings);
            break;
          default:
            break;
        }
      }
    );
  };

  render() {
    return (
      <Provider store={this.store}>
        <GlobalStyles modalContainer={this.props.modalContainer} />
        <ThemeProvider
          theme={{
            breakpoints: screenBreakpoints,
          }}
        >
          <AppContext.Provider
            value={{
              modalContainer: this.props.modalContainer,
              onUpdateChartSettings: this.props.onUpdateChartSettings,
              keenClient: this.keenClient,
              disableFilterSuggestions: this.props.disableFilterSuggestions,
            }}
          >
            <App />
          </AppContext.Provider>
        </ThemeProvider>
      </Provider>
    );
  }
  static defaultProps = {
    httpProtocol: 'https',
    timezonesHost: 'api.keen.io',
  };
}

export default QueryCreator;
