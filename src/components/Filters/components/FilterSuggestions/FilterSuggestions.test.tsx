import React from 'react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { fireEvent, render as rtlRender } from '@testing-library/react';

import FilterSuggestions from './FilterSuggestions';

const render = (overProps: any = {}) => {
  const props = {
    onSelect: jest.fn(),
    filterValue: 'test',
    suggestions: ['test1', 'test12', 'test2', 'test3'],
    suggestionsVisible: true,
    ...overProps,
  };

  const wrapper = rtlRender(<FilterSuggestions {...props} />);

  return {
    wrapper,
    props,
  };
};

mockAllIsIntersecting(true);

test('not shows suggestions when option is disabled', () => {
  const {
    wrapper: { queryByTestId },
  } = render({
    suggestionsVisible: false,
  });

  const loader = queryByTestId('test12');
  expect(loader).not.toBeInTheDocument();
});

test('shows loader when suggestions are not loaded', () => {
  const {
    wrapper: { getByTestId },
  } = render({
    suggestionsLoading: true,
  });

  const loader = getByTestId('suggestions-loader');
  expect(loader).toBeInTheDocument();
});

test('not shows loader when suggestions are loaded', () => {
  const {
    wrapper: { queryByText },
  } = render({
    suggestionsLoading: false,
  });

  const suggestion = queryByText('suggestions-loader');
  expect(suggestion).not.toBeInTheDocument();
});

test('shows suggestions based on the entered value', () => {
  const {
    wrapper: { queryByText },
  } = render({
    filterValue: 'test1',
  });

  const matchedSuggestion = queryByText('test12');
  const notMatchedSuggestion = queryByText('test3');

  expect(matchedSuggestion).toBeInTheDocument();
  expect(notMatchedSuggestion).not.toBeInTheDocument();
});

test('allows user to set filter property by clicking on the suggestion', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const element = getByText('test12');
  fireEvent.click(element);

  expect(props.onSelect).toHaveBeenCalledWith('test12');
});
