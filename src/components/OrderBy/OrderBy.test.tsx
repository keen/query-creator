import React from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { createTree } from '@keen.io/ui-core';

import { createCollection } from '../../utils';

import OrderBy from './OrderBy';

import { DEFAULT_ORDER_SETTINGS } from './constants';
import { AppContext } from '../../contexts';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const collectionSchema = { country: 'string', city: 'string' };
  const state = {
    events: {
      schemas: {
        purchases: {
          schema: collectionSchema,
          tree: createTree(collectionSchema),
          list: createCollection(collectionSchema),
        },
      },
    },
    ...storeState,
  };

  const store = mockStore({ ...state });
  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider
        value={{
          modalContainer: '#modal-root',
          onUpdateChartSettings: jest.fn(),
        }}
      >
        <OrderBy {...overProps} />
      </AppContext.Provider>
    </Provider>
  );

  return {
    store,
    wrapper,
  };
};

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }
});

test('allows user to set order by property', () => {
  const storeState = {
    query: {
      groupBy: ['country', 'city'],
      orderBy: [{ ...DEFAULT_ORDER_SETTINGS, id: 'id' }],
    },
  };

  const {
    wrapper: { getByTestId, getByText },
    store,
  } = render(storeState, { collection: 'collection' });

  const propertyItem = getByTestId('orderBy-property-item');
  fireEvent.click(propertyItem);

  const option = getByText('country');
  fireEvent.click(option);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "orderBy": Array [
            Object {
              "direction": "ASC",
              "id": "id",
              "propertyName": "country",
            },
          ],
        },
        "type": "@query/SET_ORDER_BY",
      },
    ]
  `);
});

test('allows user to set order by direction', () => {
  const storeState = {
    query: {
      groupBy: ['country', 'city'],
      orderBy: [{ ...DEFAULT_ORDER_SETTINGS, id: 'id' }],
    },
  };

  const {
    wrapper: { getByText },
    store,
  } = render(storeState, { collection: 'collection' });

  const defaultOrderDirection = getByText('ASC');
  fireEvent.click(defaultOrderDirection);

  const customOrderDirection = getByText('DESC');
  fireEvent.click(customOrderDirection);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "orderBy": Array [
            Object {
              "direction": "DESC",
              "id": "id",
              "propertyName": "result",
            },
          ],
        },
        "type": "@query/SET_ORDER_BY",
      },
    ]
  `);
});

test('allows user to remove order by settings', () => {
  const storeState = {
    query: {
      groupBy: ['country', 'city'],
      orderBy: [{ ...DEFAULT_ORDER_SETTINGS, id: 'id' }],
    },
  };

  const {
    wrapper: { container },
    store,
  } = render(storeState, { collection: 'collection' });

  const removeButton = container.querySelector('button:not(.add-button)');
  fireEvent.click(removeButton);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "orderBy": undefined,
        },
        "type": "@query/SET_ORDER_BY",
      },
    ]
  `);
});

test('should render tooltip with notification about the group by', async () => {
  const storeState = {
    query: {
      groupBy: [],
    },
  };

  const {
    wrapper: { getByTestId },
  } = render(storeState, { collection: 'collection' });

  const wrapper = getByTestId('order-by-wrapper');
  fireEvent.mouseEnter(wrapper);

  await waitFor(() => {
    expect(getByTestId('select-group-by')).toBeInTheDocument();
  });
});

test('should render tooltip with notification about the event stream', async () => {
  const storeState = {
    query: {
      groupBy: [],
    },
  };

  const {
    wrapper: { getByTestId },
  } = render(storeState);

  const wrapper = getByTestId('order-by-wrapper');
  fireEvent.mouseEnter(wrapper);

  await waitFor(() => {
    expect(getByTestId('select-event-stream')).toBeInTheDocument();
  });
});

test('should render property with drag-handle class', () => {
  const storeState = {
    query: {
      groupBy: ['country', 'city'],
      orderBy: [{ ...DEFAULT_ORDER_SETTINGS, id: 'id' }],
    },
  };
  const {
    wrapper: { container },
  } = render(storeState, { collection: 'collection' });
  const [handle] = container.getElementsByClassName('drag-handle');
  expect(handle).toBeInTheDocument();
});
