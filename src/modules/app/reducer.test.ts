import { appReducer, initialState } from './reducer';

import { setQueryReadiness } from './actions';

test('set query ready state', () => {
  const action = setQueryReadiness(true);
  const { isQueryReady } = appReducer(
    {
      ...initialState,
      isQueryReady: false,
    },
    action
  );

  expect(isQueryReady).toEqual(true);
});
