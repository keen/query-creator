import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { IncludesToday } from './RelativeTimeLabel.styles';

import { getInterval } from '../../../../utils';

type Props = {
  /** Time relativity */
  relativity: string;
  /** Time value */
  value: number;
  /** Timeframe units */
  units: string;
};

const RelativeTimeLabel: FC<Props> = ({ relativity, value, units }) => {
  const { t } = useTranslation();
  const interval = getInterval(units);
  return (
    <BodyText variant="body2" color={colors.blue[500]} enableTextEllipsis>
      <span>
        {t('query_creator_relative_time_label.label')} {value} {units}
      </span>
      {relativity === 'this' && (
        <IncludesToday>
          {interval === 'day'
            ? t('query_creator_relative_time_label.today_includes')
            : `(${t(
                'query_creator_relative_time_label.relativity_title'
              )} ${interval})`}
        </IncludesToday>
      )}
    </BodyText>
  );
};

export default RelativeTimeLabel;
