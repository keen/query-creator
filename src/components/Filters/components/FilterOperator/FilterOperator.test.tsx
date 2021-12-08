import React from 'react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import { render as rtlRender, fireEvent } from '@testing-library/react';
import { KEYBOARD_KEYS } from '@keen.io/ui-core';

import FilterOperator from './FilterOperator';

const render = (overProps: any = {}) => {
  const props = {
    propertyType: 'String',
    operator: 'eq',
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<FilterOperator {...props} />);

  return {
    wrapper,
    props,
  };
};

mockAllIsIntersecting(true);

test('shows the operators list', () => {
  const {
    wrapper: { rerender, getByTestId },
    props,
  } = render();
  rerender(<FilterOperator property="user" {...props} />);

  expect(getByTestId('operators-list')).toBeInTheDocument();
});

test('allows user to select operator', () => {
  const {
    wrapper: { getByText, getByTestId },
    props,
  } = render({ propertyType: 'Number', operator: undefined });

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const operatorElement = getByText('equals');
  fireEvent.click(operatorElement);

  expect(props.onChange).toHaveBeenCalledWith('eq');
});

test('allows user to select operator by using keyboard', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render({ propertyType: 'Number', operator: undefined });

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
    key: 'ArrowDown',
    keyCode: KEYBOARD_KEYS.DOWN,
  });
  fireEvent.keyDown(container, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });

  expect(props.onChange).toHaveBeenCalledWith('ne');
});
