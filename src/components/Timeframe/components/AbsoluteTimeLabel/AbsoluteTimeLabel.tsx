import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@keen.io/time-utils';

import { Container, Separator } from './AbsoluteTimeLabel.styles';

type Props = {
  /** Start date in ISO format */
  start: string;
  /** End date in ISO format */
  end: string;
  /** Timezone */
  timezone: string;
};

const AbsoluteTimeLabel: FC<Props> = memo(({ timezone, start, end }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <span>{formatDate(start, timezone)}</span>
      <Separator>{t('absolute_time_label.separator')}</Separator>
      <span>{formatDate(end, timezone)}</span>
    </Container>
  );
});

AbsoluteTimeLabel.displayName = 'AbsoluteTimeLabel';

export default AbsoluteTimeLabel;
