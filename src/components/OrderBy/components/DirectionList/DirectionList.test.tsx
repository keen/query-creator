import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { KEYBOARD_KEYS } from '@keen.io/ui-core';

import DirectionList from './DirectionList';

const render = (overProps: any = {}) => {
  const props = {
    direction: 'ASC',
    ...overProps,
  };

  const wrapper = rtlRender(<DirectionList {...props} />);

  return {
    wrapper,
    props,
  };
};

test('renders selected option', () => {
  const {
    wrapper: { getByText },
  } = render();
  const label = getByText('ASC');

  expect(label).toBeInTheDocument();
});

test('allows user to select property', () => {
  const onChange = jest.fn();
  const {
    wrapper: { getByText, getByTestId },
  } = render({ onChange });

  const dropableContainer = getByTestId('dropable-container');
  fireEvent.click(dropableContainer);

  const option = getByText('DESC');
  fireEvent.click(option);

  expect(onChange).toHaveBeenCalledWith('DESC');
});

test('allows user to select property by using keyboard', () => {
  const onChange = jest.fn();
  const {
    wrapper: { getByTestId },
  } = render({ onChange });

  const dropableContainer = getByTestId('dropable-container');
  fireEvent.keyDown(dropableContainer, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });
  fireEvent.keyDown(dropableContainer, {
    key: 'ArrowDown',
    keyCode: KEYBOARD_KEYS.DOWN,
  });
  fireEvent.keyDown(dropableContainer, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });

  expect(onChange).toHaveBeenCalledWith('ASC');
});
