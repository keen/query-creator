import { select, put } from 'redux-saga/effects';
import { setTimezoneOffset } from '@keen.io/time-utils';

import { updateFunnelStep, updateFunnelStepTimezone } from '../actions';
import { getFunnelSteps } from '../selectors';

import { FunnelStep } from '../../../types';

/**
 * Updates funnel step timeframe according to timezone offset
 * @param stepId - funnel step identifier
 * @param timeframe - query timeframe
 * @return void
 *
 */
export function* updateFunnelStepTimeframeOffset({
  payload,
}: ReturnType<typeof updateFunnelStepTimezone>) {
  const { timezone, stepId } = payload;
  const steps = yield select(getFunnelSteps);
  const [funnelStep] = steps.filter((step: FunnelStep) => step.id === stepId);
  const { timeframe } = funnelStep;

  if (typeof timeframe !== 'string') {
    const { start, end } = timeframe;
    const timeWithZone = {
      start: setTimezoneOffset(start, timezone),
      end: setTimezoneOffset(end, timezone),
    };

    yield put(
      updateFunnelStep(stepId, {
        timeframe: timeWithZone,
      })
    );
  }
}
