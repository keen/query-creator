import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import PropertyPath from './PropertyPath';

const render = (overProps: any = {}) => {
  const props = {
    path: ['@property'],
    ...overProps,
  };

  const wrapper = rtlRender(<PropertyPath {...props} />);

  return {
    wrapper,
    props,
  };
};

test('renders single property name', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  expect(getByText(props.path[0])).toBeInTheDocument();
});

test('renders multiple properties', () => {
  const {
    wrapper: { getByText },
    props,
  } = render({ path: ['property1', 'property2', 'property3'] });

  props.path.forEach((p) => expect(getByText(p)).toBeInTheDocument());
});

test('renders multiple properties that overflow wrapper', () => {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    value: 500,
  });

  const {
    wrapper: { getByText, queryByText },
    props,
  } = render({ path: ['property1', 'property2', 'property3'] });

  expect(queryByText(props.path[0])).toBeNull();
  expect(queryByText(props.path[1])).toBeNull();
  expect(getByText(props.path[2])).toBeInTheDocument();
});
