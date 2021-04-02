import { takeLatest } from 'redux-saga/effects';

import { selectTimezone, updateFunnelStepTimezone } from './actions';
import { updateTimeframeOffset, updateFunnelStepTimeframeOffset } from './saga';

export function* querySaga() {
  yield takeLatest(selectTimezone.type, updateTimeframeOffset);
  yield takeLatest(
    updateFunnelStepTimezone.type,
    updateFunnelStepTimeframeOffset
  );
}
