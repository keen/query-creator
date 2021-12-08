import React from 'react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import { render as rtlRender, fireEvent } from '@testing-library/react';
import { createTree, KEYBOARD_KEYS } from '@keen.io/ui-core';

import PropertyTypeCast from './PropertyTypeCast';
import FiltersContext from '../../FiltersContext';

const schema = createTree({
  'category.id': 'String',
  name: 'String',
  age: 'Number',
  loggedIn: 'Boolean',
});

const render = (overProps: any = {}) => {
  const props = {
    property: 'name',
    type: 'String',
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <FiltersContext.Provider value={{ schema }}>
      <PropertyTypeCast {...props} />
    </FiltersContext.Provider>
  );

  return {
    wrapper,
    props,
  };
};

mockAllIsIntersecting(true);

test('allows to set property type', () => {
  const {
    wrapper: { getByTestId, getByText },
    props,
  } = render();

  const propertyTypes = getByTestId('property-type-cast');
  fireEvent.click(propertyTypes);

  const type = getByText('boolean');
  fireEvent.click(type);

  expect(props.onChange).toHaveBeenCalledWith('Boolean');
});

test('allows to set property type by using keyboard', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render();

  const propertyTypes = getByTestId('property-type-cast');
  fireEvent.keyDown(propertyTypes, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });
  fireEvent.keyDown(propertyTypes, {
    key: 'ArrowDown',
    keyCode: KEYBOARD_KEYS.DOWN,
  });
  fireEvent.keyDown(propertyTypes, {
    key: 'ArrowDown',
    keyCode: KEYBOARD_KEYS.DOWN,
  });
  fireEvent.keyDown(propertyTypes, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });

  expect(props.onChange).toHaveBeenCalledWith('Datetime');
});

test('shows message about type cast consistency', () => {
  const {
    wrapper: { getByTestId, getByText },
  } = render();

  const propertyTypes = getByTestId('property-type-cast');
  fireEvent.click(propertyTypes);

  expect(
    getByText('query_creator_property_type_cast.cast_message')
  ).toBeInTheDocument();
});
