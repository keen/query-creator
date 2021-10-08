import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { KEYBOARD_KEYS } from '@keen.io/ui-core';

import SupportedInterval from './SupportedInterval';

test('allows user to select interval', async () => {
  const mockFn = jest.fn();
  const interval = 'monthly';

  const { getByText } = render(
    <SupportedInterval interval={undefined} onChange={mockFn} />
  );

  const monthlyElement = getByText(interval);

  fireEvent.click(monthlyElement);

  expect(mockFn).toHaveBeenCalledWith(interval);
});

test('allows user to select interval by using keyboard', async () => {
  const mockFn = jest.fn();
  const interval = 'monthly';

  const { getByText } = render(
    <SupportedInterval interval={undefined} onChange={mockFn} />
  );

  const monthlyElement = getByText(interval);
  fireEvent.keyDown(monthlyElement, {
    key: 'Enter',
    keyCode: KEYBOARD_KEYS.ENTER,
  });

  expect(mockFn).toHaveBeenCalledWith(interval);
});
