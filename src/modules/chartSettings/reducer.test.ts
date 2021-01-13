import { chartSettingsReducer } from './reducer';

import { updateChartSettings, resetChartSettings } from './actions';

test('updates chart settings', () => {
  const action = updateChartSettings({ stepLabels: ['Logins'] });
  const initialState = {
    stepLabels: ['Purchases'],
  };

  const result = chartSettingsReducer(initialState, action);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "stepLabels": Array [
        "Logins",
      ],
    }
  `);
});

test('reset chart settings', () => {
  const action = resetChartSettings();
  const initialState = {
    stepLabels: ['Purchases'],
  };

  const result = chartSettingsReducer(initialState, action);

  expect(result).toMatchInlineSnapshot(`Object {}`);
});
