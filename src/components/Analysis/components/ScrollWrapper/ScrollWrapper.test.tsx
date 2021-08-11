import React, { useRef } from 'react';
import { render } from '@testing-library/react';

import ScrollWrapper from './ScrollWrapper';

test('renders children nodes', () => {
  const Wrapper = () => {
    const ref = useRef(null);
    return (
      <ScrollWrapper ref={ref}>
        <div data-testid="children" />
      </ScrollWrapper>
    );
  };

  const { getByTestId } = render(<Wrapper />);

  expect(getByTestId('children')).toBeInTheDocument();
});
