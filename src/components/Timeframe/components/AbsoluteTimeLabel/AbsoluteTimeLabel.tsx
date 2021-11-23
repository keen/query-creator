import React, { FC, memo } from 'react';
import { formatDate } from '@keen.io/time-utils';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { Separator, Hours } from './AbsoluteTimeLabel.styles';

type Props = {
  /** Start date in ISO format */
  start: string;
  /** End date in ISO format */
  end: string;
  /** Timezone */
  timezone: string;
};

const AbsoluteTimeLabel: FC<Props> = memo(({ timezone, start, end }) => {
  const [startDate, startHours] = formatDate(start, timezone).split(' ');
  const [endDate, endHours] = formatDate(end, timezone).split(' ');

  return (
    <BodyText variant="body2" color={colors.blue[500]} enableTextEllipsis>
      <span>{startDate}</span>
      <Hours>{startHours}</Hours>
      <Separator>-</Separator>
      <span>{endDate}</span>
      <Hours>{endHours}</Hours>
    </BodyText>
  );
});

AbsoluteTimeLabel.displayName = 'AbsoluteTimeLabel';

export default AbsoluteTimeLabel;
