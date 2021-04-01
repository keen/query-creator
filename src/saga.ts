/* eslint-disable @typescript-eslint/camelcase */

import {
  all,
  select,
  takeLatest,
  takeEvery,
  getContext,
  fork,
  spawn,
  take,
  join,
  put,
} from 'redux-saga/effects';
import { setTimezoneOffset } from '@keen.io/time-utils';

import {
  setQueryReadiness,
  fetchProjectDetails,
  fetchProjectDetailsSuccess,
  fetchProjectDetailsError,
  APP_START,
  FETCH_PROJECT_DETAILS,
} from './modules/app';

import {
  getOrderBy,
  getTimeframe,
  setTimeframe,
  getFunnelSteps,
  setFunnelSteps,
  setFunnelStepFilters,
  updateFunnelStep,
  setPropertyNames,
  setGroupBy,
  setOrderBy,
  setFilters,
  setQuery,
  postProcessingFinished,
  SerializeQueryAction,
  SelectTimezoneAction,
  SelectEventCollectionAction,
  SelectFunnelStepEventCollectionAction,
  UpdateFunnelStepTimezoneAction,
  SET_GROUP_BY,
  SERIALIZE_QUERY,
  SELECT_TIMEZONE,
  SELECT_EVENT_COLLECTION,
  SELECT_FUNNEL_STEP_EVENT_COLLECTION,
  UPDATE_FUNNEL_STEP_TIMEZONE,
} from './modules/query';

import {
  FetchCollectionSchemaAction,
  fetchCollectionSchema,
  fetchCollectionSchemaSuccess,
  fetchCollectionSchemaError,
  setEventsCollections,
  setCollectionSchemaLoading,
  getSchemas,
  computeSchemaSuccess,
  FETCH_COLLECTION_SCHEMA_SUCCESS,
  FETCH_COLLECTION_SCHEMA,
  SCHEMA_COMPUTED,
} from './modules/events';

import {
  serializeOrderBy,
  serializeFilters,
  serializeFunnelSteps,
  serializePropertyNames,
} from './serializers';

import { createTree, createCollection, useQueryPostProcessing } from './utils';

import { Filter, OrderBy, FunnelStep } from './types';
import { SetGroupByAction } from './modules/query/types';
import {
  timezoneSaga,
  timezoneActions,
  getDefaultTimezone,
} from './modules/timezone';

function* appStart() {
  yield put(fetchProjectDetails());
  yield put(timezoneActions.fetchTimezones());
}

function* fetchProject() {
  const client = yield getContext('keenClient');

  try {
    const url = client.url('/3.0/projects/{projectId}', {
      api_key: client.config.masterKey,
    });
    const { events } = yield fetch(url).then((response) => response.json());
    const collections = events.map(({ name }) => name);

    yield put(fetchProjectDetailsSuccess());
    yield put(setEventsCollections(collections));
  } catch (err) {
    yield put(fetchProjectDetailsError(err));
  }
}

function* transformSchema(
  collection: string,
  properties: Record<string, string>
) {
  const tree = yield createTree(properties);
  const list = yield createCollection(properties);

  const schema = {
    tree,
    list,
  };

  yield put(computeSchemaSuccess(collection, schema));
}

function* fetchSchema(action: FetchCollectionSchemaAction) {
  const collection = action.payload.collection;
  const client = yield getContext('keenClient');

  yield put(setCollectionSchemaLoading(collection, true));

  try {
    const url = client.url(`/3.0/projects/{projectId}/events/${collection}`, {
      api_key: client.config.masterKey,
    });
    const { properties } = yield fetch(url).then((response) => response.json());

    yield put(fetchCollectionSchemaSuccess(collection, properties));
    yield spawn(transformSchema, collection, properties);
  } catch (err) {
    yield put(fetchCollectionSchemaError(err));
  } finally {
    yield put(setCollectionSchemaLoading(collection, false));
  }
}

export function* selectCollection(action: SelectEventCollectionAction) {
  const collection = action.payload.name;
  if (collection) {
    const schemas = yield select(getSchemas);
    const isSchemaExist = schemas[collection];

    if (!isSchemaExist) {
      yield put(fetchCollectionSchema(collection));
    }
  }

  yield put(setGroupBy(undefined));
  yield put(setOrderBy(undefined));
  yield put(setPropertyNames(undefined));
  yield put(setFilters([]));
}

function* selectFunnelStepCollection(
  action: SelectFunnelStepEventCollectionAction
) {
  const collection = action.payload.name;
  const schemas = yield select(getSchemas);
  const isSchemaExist = schemas[collection];

  if (!isSchemaExist) yield put(fetchCollectionSchema(collection));
}

/**
 * Udaptes query absolute timeframe according to timezone offset
 * @param timeframe - query timeframe
 * @return void
 *
 */
function* selectTimezone(action: SelectTimezoneAction) {
  const { timezone } = action.payload;
  const timeframe = yield select(getTimeframe);

  if (typeof timeframe !== 'string') {
    const { start, end } = timeframe;
    const timeWithZone = {
      start: setTimezoneOffset(start, timezone),
      end: setTimezoneOffset(end, timezone),
    };
    yield put(setTimeframe(timeWithZone));
  }
}

/**
 * Updates funnel step timeframe according to timezone offset
 * @param stepId - funnel step identifier
 * @param timeframe - query timeframe
 * @return void
 *
 */
function* updateFunnelStepTimezone(action: UpdateFunnelStepTimezoneAction) {
  const { timezone } = action.payload;
  const steps = yield select(getFunnelSteps);
  const [funnelStep] = steps.filter(
    (step: FunnelStep) => step.id === action.payload.stepId
  );
  const { timeframe } = funnelStep;

  if (typeof timeframe !== 'string') {
    const { start, end } = timeframe;
    const timeWithZone = {
      start: setTimezoneOffset(start, timezone),
      end: setTimezoneOffset(end, timezone),
    };

    console.log(timezone, timeWithZone);

    yield put(
      updateFunnelStep(action.payload.stepId, {
        timeframe: timeWithZone,
      })
    );
  }
}

function* storeEventSchemas() {
  const schemas = yield select(getSchemas);
  window.__QUERY_CREATOR_SCHEMAS__ = schemas;
}

export function* transformFilters(collection: string, filters: Filter[]) {
  let schemas = yield select(getSchemas);
  let collectionSchema = schemas[collection];

  if (!collectionSchema) {
    while (true) {
      yield take(FETCH_COLLECTION_SCHEMA_SUCCESS);
      schemas = yield select(getSchemas);
      if (schemas[collection]) {
        collectionSchema = schemas[collection];
        break;
      }
    }
  }

  const { schema } = collectionSchema;

  const filtersSettings = serializeFilters(filters, schema);
  yield put(setFilters(filtersSettings));
}

export function* transformStepFilters(
  collection: string,
  filters: Filter[],
  stepId: string
) {
  let schemas = yield select(getSchemas);
  let collectionSchema = schemas[collection];

  if (!collectionSchema) {
    while (true) {
      yield take(FETCH_COLLECTION_SCHEMA_SUCCESS);
      schemas = yield select(getSchemas);
      if (schemas[collection]) {
        collectionSchema = schemas[collection];
        break;
      }
    }
  }

  const { schema } = collectionSchema;

  const filtersSettings = serializeFilters(filters, schema);
  yield put(setFunnelStepFilters(stepId, filtersSettings));
}

export function* transformOrderBy(orderBy: string | OrderBy | OrderBy[]) {
  const orderBySettings = serializeOrderBy(orderBy);
  yield put(setOrderBy(orderBySettings));
}

export function* transformPropertyNames(propertyNames: string | string[]) {
  const propertiesSettings = serializePropertyNames(propertyNames);
  yield put(setPropertyNames(propertiesSettings));
}

/**
 * Flow responsible for serializing query and asynchronous post processing
 * parts that required additional translations or data from API.
 *
 * @param query - query structure
 * @return void
 *
 */
function* serializeQuery(action: SerializeQueryAction) {
  const {
    payload: { query },
  } = action;

  const schemas = yield select(getSchemas);
  const usePostProcessing = useQueryPostProcessing(query);
  const transformTasks = [];

  yield put(setQueryReadiness(!usePostProcessing));

  const { filters, orderBy, steps, propertyNames, ...querySettings } = query;
  const initialQuery = {
    ...querySettings,
  };

  const defaultTimezone = yield select(getDefaultTimezone);
  if (!query.timezone) {
    initialQuery.timezone = defaultTimezone;
  }

  yield put(setQuery(initialQuery));

  if (query.eventCollection && !schemas[query.eventCollection]) {
    yield put(fetchCollectionSchema(query.eventCollection));
  }

  if (steps) {
    const { transformedSteps, stepsFilters } = serializeFunnelSteps(steps);
    yield put(setFunnelSteps(transformedSteps));

    if (stepsFilters && stepsFilters.length) {
      const stepFiltersTask = yield all(
        stepsFilters.map(({ eventCollection, filters, id }) =>
          fork(transformStepFilters, eventCollection, filters, id)
        )
      );

      transformTasks.push(...stepFiltersTask);
    }

    const schemasToFetch = steps
      .filter(({ eventCollection }) => !schemas[eventCollection])
      .map(({ eventCollection }) => eventCollection);

    yield all(
      schemasToFetch.map((eventCollection) =>
        put(fetchCollectionSchema(eventCollection))
      )
    );
  }

  if (propertyNames) {
    const propertyTask = yield fork(transformPropertyNames, propertyNames);
    transformTasks.push(propertyTask);
  }

  if (filters) {
    const filtersTask = yield fork(
      transformFilters,
      query.eventCollection,
      filters
    );
    transformTasks.push(filtersTask);
  }

  if (orderBy) {
    const orderByTask = yield fork(transformOrderBy, orderBy);
    transformTasks.push(orderByTask);
  }

  if (usePostProcessing) {
    yield join(transformTasks);
    yield put(setQueryReadiness(true));
    yield put(postProcessingFinished());
  }
}

function* updateGroupBy(action: SetGroupByAction) {
  const {
    payload: { groupBy },
  } = action;
  const orderBy = yield select(getOrderBy);

  let orderBySettings: OrderBy[];
  if (groupBy && orderBy && groupBy.length && Object.keys(orderBy).length) {
    orderBySettings = orderBy.filter(
      ({ propertyName }: OrderBy) =>
        groupBy.includes(propertyName) || propertyName === 'result'
    );
  }

  yield put(setOrderBy(orderBySettings));
}

function* watcher() {
  yield takeLatest(APP_START, appStart);
  yield takeLatest(SERIALIZE_QUERY, serializeQuery);
  yield takeLatest(FETCH_PROJECT_DETAILS, fetchProject);
  yield takeEvery(FETCH_COLLECTION_SCHEMA, fetchSchema);
  yield takeLatest(SELECT_TIMEZONE, selectTimezone);
  yield takeLatest(SELECT_EVENT_COLLECTION, selectCollection);
  yield takeLatest(SCHEMA_COMPUTED, storeEventSchemas);
  yield takeLatest(
    SELECT_FUNNEL_STEP_EVENT_COLLECTION,
    selectFunnelStepCollection
  );
  yield takeLatest(SET_GROUP_BY, updateGroupBy);
  yield takeLatest(UPDATE_FUNNEL_STEP_TIMEZONE, updateFunnelStepTimezone);
}

export default function* rootSaga() {
  yield all([watcher(), timezoneSaga()]);
}
