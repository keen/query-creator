/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { AppContext } from '../../contexts';

import FunnelSteps from './FunnelSteps';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'id'),
  };
});

const render = (storeState: any = {}) => {
  const mockStore = configureStore([]);
  const state = {
    query: {
      steps: [],
    },
    chartSettings: {},
    timezone: {
      defaultTimezoneForQuery: 'Africa/Nairobi',
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const wrapper = rtlRender(
    <AppContext.Provider
      value={{
        onUpdateChartSettings: () => {},
        modalContainer: 'modalContainer',
      }}
    >
      <Provider store={store}>
        <FunnelSteps />
      </Provider>
    </AppContext.Provider>
  );

  return {
    store,
    wrapper,
  };
};

test('allows user to add funnel step', () => {
  const {
    wrapper: { getByTestId },
    store,
  } = render();

  const button = getByTestId('add-step-button');

  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "defaultTimezone": "Africa/Nairobi",
          "id": "id",
        },
        "type": "@query/ADD_FUNNEL_STEP",
      },
    ]
  `);
});

test('resets funnel steps', () => {
  const {
    wrapper: { unmount },
    store,
  } = render();
  unmount();

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "steps": Array [],
        },
        "type": "@query/SET_FUNNEL_STEPS",
      },
    ]
  `);
});
