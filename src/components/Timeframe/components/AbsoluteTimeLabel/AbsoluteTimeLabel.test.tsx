import React from 'react';
import { render } from '@testing-library/react';

import AbsoluteTimeLabel from './AbsoluteTimeLabel';

const props = {
  start: '2021-03-02T12:00:00Z',
  end: '2021-03-03T13:00:00Z',
  timezone: 'UTC',
};

test('renders formatted start date', () => {
  const { getByText } = render(<AbsoluteTimeLabel {...props} />);

  expect(getByText('2021-03-02')).toBeInTheDocument();
  expect(getByText('12:00')).toBeInTheDocument();
});

test('renders formatted end date', () => {
  const { getByText } = render(<AbsoluteTimeLabel {...props} />);

  expect(getByText('2021-03-03')).toBeInTheDocument();
  expect(getByText('13:00')).toBeInTheDocument();
});
