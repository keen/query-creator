import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { KEYBOARD_KEYS } from '@keen.io/ui-core';

import FilterBoolean from './FilterBoolean';

const render = (overProps: any = {}) => {
  const props = {
    onChange: jest.fn(),
    value: true,
    ...overProps,
  };

  const wrapper = rtlRender(<FilterBoolean {...props} />);

  return {
    wrapper,
    props,
  };
};

test('renders the current value', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('true')).toBeInTheDocument();
});

test('allows user to select value', () => {
  const {
    wrapper: { getByTestId, getByText },
    props,
  } = render();

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const element = getByText('false');
  fireEvent.click(element);

  expect(props.onChange).toHaveBeenCalledWith(false);
});

test('allows user to select value by using keyboard', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render();

  const container = getByTestId('dropable-container');
  fireEvent.keyDown(container, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });
  fireEvent.keyDown(container, {
    key: 'ArrowDown',
    keyCode: KEYBOARD_KEYS.DOWN,
  });
  fireEvent.keyDown(container, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });

  expect(props.onChange).toHaveBeenCalledWith(false);
});
