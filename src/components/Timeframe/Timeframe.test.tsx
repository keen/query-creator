import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import Timeframe from './Timeframe';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);

const render = (overProps: any = {}, overStoreState: any = {}) => {
  const state = {
    timezone: {
      timezoneSelectionDisabled: false,
    },
    ...overStoreState,
  };
  const store = mockStore({ ...state });
  const props = {
    id: 'id',
    onTimeframeChange: jest.fn(),
    onTimezoneChange: jest.fn(),
    onReset: jest.fn(),
    value: 'this_10_days',
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <Timeframe {...props} />
    </Provider>
  );

  return {
    props,
    wrapper,
  };
};

test('should render relative time user interface', () => {
  const {
    wrapper: { getByTestId },
  } = render();

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  expect(getByTestId('relative-time')).toBeInTheDocument();
});

test('should render absolute time user interface', () => {
  const timeframe = {
    start: undefined,
    end: undefined,
  };
  const {
    wrapper: { getByTestId },
  } = render({ value: timeframe });

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  expect(getByTestId('absolute-time')).toBeInTheDocument();
});

test('should render timezone user interface', () => {
  const {
    wrapper: { getByTestId },
  } = render();

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  expect(getByTestId('timezone')).toBeInTheDocument();
});

test('should call "onReset" handler', () => {
  const {
    wrapper: { unmount },
    props,
  } = render();
  unmount();

  expect(props.onReset).toHaveBeenCalled();
});

test('should render notification', () => {
  const {
    wrapper: { getByText, getByTestId },
  } = render();

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  expect(getByText('query_creator_timeframe.notification')).toBeInTheDocument();
});

test('should not render tooltip on timezone section hover when timezone selection is enabled', async () => {
  const {
    wrapper: { getByTestId, queryByText },
  } = render();

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  const timezoneContainer = getByTestId('timezone-container');
  fireEvent.mouseOver(timezoneContainer);

  const testId = await queryByText(
    'query_creator_timezone.selection_disabled_description'
  );
  expect(testId).not.toBeInTheDocument();
});

test('should render tooltip on timezone section hover when timezone selection is disabled', async () => {
  const {
    wrapper: { getByTestId, queryByText },
  } = render(
    {},
    {
      timezone: {
        timezoneSelectionDisabled: true,
      },
    }
  );

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  const timezoneContainer = getByTestId('timezone-container');
  fireEvent.mouseOver(timezoneContainer);

  const testId = await queryByText(
    'query_creator_timezone.selection_disabled_description'
  );
  expect(testId).toBeInTheDocument();
});
