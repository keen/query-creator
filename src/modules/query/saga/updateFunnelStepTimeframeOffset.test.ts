import sagaHelper from 'redux-saga-testing';
import { select, put } from 'redux-saga/effects';

import { updateFunnelStepTimeframeOffset } from './updateFunnelStepTimeframeOffset';

import { updateFunnelStep, updateFunnelStepTimezone } from '../actions';
import { getFunnelSteps } from '../selectors';

import { FunnelStep } from '../../../types';

const funnelStep: FunnelStep = {
  id: '@step/01',
  actorProperty: 'user.id',
  eventCollection: 'logins',
  inverted: false,
  optional: false,
  withActors: false,
  timeframe: 'this_14_days',
  timezone: 'UTC',
  filters: [],
};

describe('Scenario 1: User modifies funnel step timezone with relative timeframe', () => {
  const action = updateFunnelStepTimezone('@step/01', 'America/New_York');
  const test = sagaHelper(updateFunnelStepTimeframeOffset(action));

  test('selects collection of funnel steps', (result) => {
    expect(result).toEqual(select(getFunnelSteps));

    return [funnelStep];
  });

  test('terminates saga', (result) => {
    expect(result).toBeUndefined();
  });
});

describe('Scenario 2: User modifies funnel step timezone with absolute timeframe', () => {
  const stepId = '@step/01';
  const action = updateFunnelStepTimezone(stepId, 'America/New_York');
  const test = sagaHelper(updateFunnelStepTimeframeOffset(action));

  test('selects collection of funnel steps', (result) => {
    expect(result).toEqual(select(getFunnelSteps));

    return [
      {
        ...funnelStep,
        timeframe: {
          start: '2021-04-01T00:00:00+12:00',
          end: '2021-04-02T00:00:00+12:00',
        },
      },
    ];
  });

  test('updates offset for absolute timeframe in funnel step', (result) => {
    const timeframe = {
      start: '2021-04-01T00:00:00-04:00',
      end: '2021-04-02T00:00:00-04:00',
    };

    expect(result).toEqual(put(updateFunnelStep(stepId, { timeframe })));
  });

  test('terminates saga', (result) => {
    expect(result).toBeUndefined();
  });
});
