import React from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';

import Limit from './Limit';
import { AppContext } from '../../contexts';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const store = mockStore({ ...storeState });

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider
        value={{
          modalContainer: '#modal-root',
          onUpdateChartSettings: jest.fn(),
        }}
      >
        <Limit {...overProps} />
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

test('allows user to set limit', () => {
  const {
    wrapper: { getByTestId },
    store,
  } = render({
    query: {
      groupBy: ['category'],
      orderBy: [{ propertyName: 'result', direction: 'DESC' }],
      limit: undefined,
    },
  });
  const input = getByTestId('limit');

  fireEvent.change(input, { target: { value: 80 } });

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "limit": 80,
        },
        "type": "@query/SET_LIMIT",
      },
    ]
  `);
});

test('allows user to set limit', () => {
  const {
    wrapper: { container },
    store,
  } = render({
    query: {
      groupBy: ['category'],
      orderBy: [{ propertyName: 'result', direction: 'DESC' }],
      limit: undefined,
    },
  });
  const input = container.querySelector('input[type="number"]');

  fireEvent.change(input, { target: { value: 80 } });

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "limit": 80,
        },
        "type": "@query/SET_LIMIT",
      },
    ]
  `);
});

test('do not allows user to set limit without order settings', () => {
  const {
    wrapper: { getByTestId },
  } = render({
    query: {
      groupBy: ['category'],
      orderBy: undefined,
      limit: undefined,
    },
  });
  const input = getByTestId('limit');

  expect(input).toBeDisabled();
});

test('do not allows user to set limit without group by settings', () => {
  const {
    wrapper: { getByTestId },
  } = render({
    query: {
      groupBy: undefined,
      orderBy: [{ propertyName: 'result', direction: 'DESC' }],
      limit: undefined,
    },
  });
  const input = getByTestId('limit');

  expect(input).toBeDisabled();
});

test('allows user to remove limit', () => {
  const {
    wrapper: { getByTestId },
    store,
  } = render({
    query: {
      limit: 100,
      groupBy: ['category'],
      orderBy: [{ propertyName: 'result', direction: 'DESC' }],
    },
  });
  const input = getByTestId('limit');

  fireEvent.change(input, { target: { value: null } });

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "limit": undefined,
        },
        "type": "@query/SET_LIMIT",
      },
    ]
  `);
});

test('should render tooltip with notification about the order', async () => {
  const {
    wrapper: { getByTestId },
  } = render(
    {
      query: {
        limit: 100,
        groupBy: ['category'],
        orderBy: null,
      },
    },
    {
      collection: 'collection',
    }
  );

  const wrapper = getByTestId('limit-wrapper');
  fireEvent.mouseEnter(wrapper);

  await waitFor(() => {
    expect(getByTestId('order-data-tooltip')).toBeInTheDocument();
  });
});

test('should render tooltip with notification about the event stream', async () => {
  const {
    wrapper: { getByTestId },
  } = render({
    query: {
      limit: 100,
      groupBy: null,
      orderBy: null,
    },
  });

  const wrapper = getByTestId('limit-wrapper');
  fireEvent.mouseEnter(wrapper);

  await waitFor(() => {
    expect(getByTestId('select-event-stream-tooltip')).toBeInTheDocument();
  });
});
