import React, { FC, memo } from 'react';
import dayjs from 'dayjs';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { Separator, Hours } from './AbsoluteTimeLabel.styles';

type Props = {
  /** Start date in ISO format */
  start: string;
  /** End date in ISO format */
  end: string;
};

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

const AbsoluteTimeLabel: FC<Props> = memo(({ start, end }) => {
  const [startDate, startHours] = dayjs(start.substring(0, 19))
    .format(DATE_TIME_FORMAT)
    .split(' ');
  const [endDate, endHours] = dayjs(end.substring(0, 19))
    .format(DATE_TIME_FORMAT)
    .split(' ');

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
