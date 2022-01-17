import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import {
  render as rtlRender,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { createTree } from '@keen.io/ui-core';

import { SearchContext } from '../../../../contexts';
import { AppContext } from '../../../../contexts';
import FiltersContext from '../../FiltersContext';

import Filter from './Filter';

const schema = createTree({
  'category.id': 'String',
  name: 'String',
  age: 'Number',
  loggedIn: 'Boolean',
});

mockAllIsIntersecting(true);
beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

const render = (overProps: any = {}, overStoreState: any = {}) => {
  const mockStore = configureStore([]);
  const storeState = {
    query: {
      propertyNames: [],
      latest: 100,
    },
    events: {},
    ...overStoreState,
  };
  const store = mockStore({ ...storeState });

  const props = {
    id: 'id',
    properties: schema,
    onRemove: jest.fn(),
    onSearchProperties: jest.fn(),
    onPropertyChange: jest.fn(),
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider
        value={{
          onUpdateChartSettings: () => jest.fn(),
          modalContainer: 'modalContainer',
          keenClient: { query: jest.fn(() => Promise.resolve({ data: {} })) },
        }}
      >
        <SearchContext.Provider
          value={{ expandTree: true, searchPropertiesPhrase: null }}
        >
          <FiltersContext.Provider value={{ schema }}>
            <Filter {...props} />
          </FiltersContext.Provider>
        </SearchContext.Provider>
      </AppContext.Provider>
    </Provider>
  );

  return {
    wrapper,
    props,
  };
};

test('allows user to remove filter', async () => {
  const filter = {
    propertyName: 'id',
    propertyType: undefined,
    propertyValue: undefined,
    operator: undefined,
  };

  const {
    wrapper: { getByTestId },
    props,
  } = render({ filter });

  const button = getByTestId('action-button');
  fireEvent.click(button);

  await waitFor(() => expect(props.onRemove).toHaveBeenCalled());
});

test('do not allows user to create empty filter', () => {
  const filter = {
    propertyName: undefined,
    propertyType: undefined,
    propertyValue: undefined,
    operator: undefined,
  };

  const {
    wrapper: { getByTestId },
    props,
  } = render({ filter });

  const element = getByTestId('filter-item');
  fireEvent.click(element);

  expect(props.onRemove).toHaveBeenCalled();
});

test('allows user to set filter property', () => {
  const filter = {
    propertyName: undefined,
    propertyType: undefined,
    propertyValue: undefined,
    operator: undefined,
  };

  const {
    wrapper: { getByTestId, getByText },
    props,
  } = render({ filter });

  const element = getByTestId('filter-property');
  fireEvent.click(element);

  const property = getByText('age');
  fireEvent.click(property);

  expect(props.onPropertyChange).toHaveBeenCalledWith('age');
});

test('allows user to cast property type', async () => {
  const filter = {
    propertyName: 'purchases',
    propertyType: 'Number',
    propertyValue: '',
    operator: 'lt',
  };

  const {
    wrapper: { getByText, getByTestId },
    props,
  } = render({ filter });

  const propertyTypes = getByTestId('property-type-cast');
  fireEvent.click(propertyTypes);

  const type = getByText('boolean');
  fireEvent.click(type);

  await waitFor(() =>
    expect(props.onChange).toHaveBeenCalledWith({
      ...filter,
      propertyType: 'Boolean',
      operator: 'eq',
      propertyValue: true,
    })
  );
});

test('allows user to set operator', async () => {
  const filter = {
    propertyName: 'purchases',
    propertyType: 'Number',
    propertyValue: 20,
    operator: 'eq',
  };

  const {
    wrapper: { getByText },
    props,
  } = render({ filter });

  const operators = getByText('equals');
  fireEvent.click(operators);

  const operator = getByText('does not equal');
  fireEvent.click(operator);

  await waitFor(() =>
    expect(props.onChange).toHaveBeenCalledWith({
      ...filter,
      operator: 'ne',
    })
  );
});

test('updates filter value based on operator', async () => {
  const filter = {
    propertyName: 'purchases',
    propertyType: 'Number',
    propertyValue: 20,
    operator: 'eq',
  };

  const {
    wrapper: { getByText },
    props,
  } = render({ filter });

  const operators = getByText('equals');
  fireEvent.click(operators);

  const operator = getByText('property exists');
  fireEvent.click(operator);

  await waitFor(() =>
    expect(props.onChange).toHaveBeenCalledWith({
      ...filter,
      operator: 'exists',
      propertyValue: true,
    })
  );
});

test('allows user to set filter value', async () => {
  const filter = {
    propertyName: 'name',
    propertyType: 'String',
    propertyValue: '',
    operator: 'eq',
  };

  const {
    wrapper: { getByTestId },
    props,
  } = render({ filter });

  const input = getByTestId('filter-value-input');
  fireEvent.change(input, { target: { value: 'Andrew' } });

  await waitFor(() =>
    expect(props.onChange).toHaveBeenCalledWith({
      ...filter,
      propertyValue: 'Andrew',
    })
  );
});
