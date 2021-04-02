import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@keen.io/ui-core';
import { Timeframe } from '@keen.io/query';
import { getDefaultAbsoluteTime } from '@keen.io/time-utils';

import { TabsSettings } from './types';

import { DEFAULT_TIMEFRAME } from './constants';

type Props = {
  /** Query timeframe */
  timeframe: Timeframe;
  /** Query timezone */
  timezone: string;
  /** Timeframe change handler */
  onTimeframeChange: (timeframe: Timeframe) => void;
  /** Navigation disable indicator */
  isDisabled: boolean;
};

const Navigation: FC<Props> = ({
  timeframe,
  timezone,
  onTimeframeChange,
  isDisabled,
}) => {
  const { t } = useTranslation();
  const tabs = [
    {
      label: t('query_creator_timeframe.relative'),
      id: TabsSettings.RELATIVE,
    },
    {
      label: t('query_creator_timeframe.absolute'),
      id: TabsSettings.ABSOLUTE,
    },
  ];

  const activeTab =
    typeof timeframe === 'string'
      ? TabsSettings.RELATIVE
      : TabsSettings.ABSOLUTE;

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onClick={(tabId) => {
        if (isDisabled) return;
        if (tabId === TabsSettings.RELATIVE) {
          onTimeframeChange(DEFAULT_TIMEFRAME);
        } else {
          onTimeframeChange(getDefaultAbsoluteTime(timezone));
        }
      }}
    />
  );
};

export default Navigation;
