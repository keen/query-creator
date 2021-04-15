import React, { FC, useState, useCallback } from 'react';
import { Icon } from '@keen.io/icons';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { Container, Wrapper } from './PropertyPath.styles';

type Props = {
  /** Property path */
  path: string[];
};

const OVERFLOW_CONTENT = '...';

const PropertyPath: FC<Props> = ({ path }) => {
  const pathLength = path.length;

  const [isOverflow, setOverflow] = useState(false);

  const propertyRef = useCallback((node) => {
    if (node !== null) {
      const overflow = node.scrollWidth > node.offsetWidth;
      setOverflow(overflow);
    }
  }, []);

  return (
    <Container ref={propertyRef}>
      {path.map((slice, idx, arr) => {
        if (idx + 1 < pathLength) {
          return [
            <BodyText
              variant="body2"
              color={colors.blue[500]}
              key={`${slice}-${idx}`}
            >
              {isOverflow && idx !== arr.length - 1 ? OVERFLOW_CONTENT : slice}
            </BodyText>,
            <Wrapper key={`${slice}-${idx}-wrapper`}>
              <Icon
                type="caret-right"
                width={10}
                height={10}
                fill={colors.blue[100]}
              />
            </Wrapper>,
          ];
        }

        return <span key={`${slice}-${idx}`}>{slice}</span>;
      })}
    </Container>
  );
};

export default PropertyPath;
