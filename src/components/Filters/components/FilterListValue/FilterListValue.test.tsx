import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { KEYBOARD_KEYS } from '@keen.io/ui-core';

import FilterListValue from './FilterListValue';

const render = (overProps: any = {}) => {
  const props = {
    onChange: jest.fn(),
    items: [],
    propertyType: 'String',
    ...overProps,
  };

  const wrapper = rtlRender(<FilterListValue {...props} />);

  return {
    wrapper,
    props,
  };
};

test('renders the current value', () => {
  const items = ['category', 1];
  const {
    wrapper: { getByText },
  } = render({ items });

  expect(getByText('category, 1')).toBeInTheDocument();
});

test('allows user to add "string" value to the list', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render();

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const input = getByTestId('list-input');
  fireEvent.keyPress(input, {
    keyCode: KEYBOARD_KEYS.ENTER,
    target: { value: 'category' },
  });

  expect(props.onChange).toHaveBeenCalledWith(['category']);
});

test('allows user to add "numeric" value to the list', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render({ propertyType: 'Number' });

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const input = getByTestId('list-input');
  fireEvent.keyPress(input, {
    keyCode: KEYBOARD_KEYS.ENTER,
    target: { value: '1000' },
  });

  expect(props.onChange).toHaveBeenCalledWith([1000]);
});

test('allows user to add number to "list" property type', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render({ propertyType: 'List' });

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const input = getByTestId('list-input');
  fireEvent.keyPress(input, {
    keyCode: KEYBOARD_KEYS.ENTER,
    target: { value: '10' },
  });

  expect(props.onChange).toHaveBeenCalledWith([10]);
});

test('allows user to add string to "list" property type', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render({ propertyType: 'List' });

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const input = getByTestId('list-input');
  fireEvent.keyPress(input, {
    keyCode: KEYBOARD_KEYS.ENTER,
    target: { value: 'marketing' },
  });

  expect(props.onChange).toHaveBeenCalledWith(['marketing']);
});

test('do not allows user to add already existing value to the list', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render({
    items: ['id'],
  });

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const input = getByTestId('list-input');
  fireEvent.keyPress(input, {
    keyCode: KEYBOARD_KEYS.ENTER,
    target: { value: 'id' },
  });

  expect(props.onChange).not.toHaveBeenCalledWith();
});

test('allows user to remove value from the list', () => {
  const {
    wrapper: { getByTestId, getAllByTestId },
    props,
  } = render({
    items: ['id', 'category'],
  });

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const [removeButton] = getAllByTestId('action-button');
  fireEvent.click(removeButton);

  expect(props.onChange).toHaveBeenCalledWith(['category']);
});
