import React from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';

import GroupBy from './GroupBy';
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
        <GroupBy {...overProps} />
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

test('do not allows user to add empty group by settings', async () => {
  const storeState = {
    query: {
      groupBy: undefined,
    },
    events: {
      schemas: {},
    },
  };

  const {
    wrapper: { getByTestId, queryByTestId },
  } = render(storeState);

  const button = getByTestId('action-button');
  fireEvent.click(button);

  await waitFor(() => {
    const element = queryByTestId('groupBy-settings-item');
    expect(element).not.toBeInTheDocument();
  });
});

test('allows user to add group by settings', async () => {
  const storeState = {
    query: {
      groupBy: [],
      eventCollection: 'logins',
    },
    events: {
      schemas: {},
    },
  };

  const {
    wrapper: { getByTestId, findByTestId },
  } = render(storeState, { collection: 'logins' });

  const button = getByTestId('action-button');
  fireEvent.click(button);

  const groupByItem = await findByTestId('groupBy-settings-item');
  expect(groupByItem).toBeInTheDocument();
});

test('should render exact number of properties with preserved order', async () => {
  const storeState = {
    query: {
      groupBy: ['date', 'userId'],
    },
    events: {
      schemas: {
        purchases: { date: 'String', userId: 'String' },
      },
    },
  };

  const {
    wrapper: { getAllByTestId },
  } = render(storeState, { collection: 'purchases' });

  const items = getAllByTestId('searchable-property');

  expect(items.length).toEqual(Object.keys(storeState.query.groupBy).length);

  items.forEach((item, idx) => {
    expect(item.textContent).toEqual(`${storeState.query.groupBy[idx]}×`);
  });
});

test('should render title', () => {
  const storeState = {
    query: {
      groupBy: undefined,
    },
    events: {
      schemas: {
        purchases: { date: 'String', userId: 'String' },
      },
    },
  };

  const {
    wrapper: { getByText },
  } = render(storeState, { collection: 'purchases' });

  const title = getByText('query_creator_group_by.title');
  expect(title).toBeInTheDocument();
});

test('should render tooltip with suggestion to select event stream', async () => {
  const storeState = {
    query: {
      groupBy: undefined,
    },
    events: {
      schemas: {
        purchases: { date: 'String', userId: 'String' },
      },
    },
  };

  const {
    wrapper: { getByTestId },
  } = render(storeState);

  const wrapper = getByTestId('group-by-wrapper');
  fireEvent.mouseEnter(wrapper);

  await waitFor(() => {
    expect(getByTestId('select-event-stream')).toBeInTheDocument();
  });
});
