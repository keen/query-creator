import React, { FC, useMemo } from 'react';
import { KEYBOARD_KEYS } from '@keen.io/ui-core';

import { Container, IntervalButton } from './SupportedInterval.styles';

import { INTERVALS } from './constants';

type Props = {
  /** Supported interval */
  interval?: string;
  /** Change event handler */
  onChange: (interval: string) => void;
};

const SupportedInterval: FC<Props> = ({ interval, onChange }) => {
  const options = useMemo(
    () =>
      INTERVALS.map((name) => ({
        label: name,
        value: name,
      })),
    []
  );

  return (
    <Container data-testid="supported-interval">
      {options.map((option: { label: string; value: string }) => (
        <IntervalButton
          key={option.value}
          isActive={interval === option.value}
          onClick={() => onChange(option.value)}
          onKeyDown={(e) => {
            if (e.keyCode === KEYBOARD_KEYS.ENTER) {
              onChange(option.value);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {option.label}
        </IntervalButton>
      ))}
    </Container>
  );
};

export default SupportedInterval;
