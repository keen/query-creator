import React, { FC, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import {
  Dropdown,
  Tabs,
  DropableContainer,
  DropableContainerVariant as Variant,
  RelativeTime,
  convertRelativeTime,
  AbsoluteTime,
  getDefaultAbsoluteTime,
  TIME_PICKER_CLASS,
  Timezone,
  TitleComponent,
  UI_LAYERS,
  Tooltip,
} from '@keen.io/ui-core';
import { Timezones, Timeframe as TimeframeType } from '@keen.io/query';

import { Container, SettingsContainer, Notification } from './Timeframe.styles';

import AbsoluteTimeLabel from '../AbsoluteTimeLabel';
import RelativeTimeLabel from '../RelativeTimeLabel';

import { getTimezoneValue } from './utils';
import { getEventPath } from '../../utils';

import { ABSOLUTE_TAB, RELATIVE_TAB } from './constants';
import { DEFAULT_TIMEFRAME } from '../../modules/query';
import { getTimezoneSelectionDisabled } from '../../modules/timezone';
import { TOOLTIP_MOTION } from '../../constants';

type Props = {
  /** Unique identifer */
  id: string;
  /** Timeframe change event handler */
  onTimeframeChange: (timeframe: TimeframeType) => void;
  /** Timezone change event handler */
  onTimezoneChange: (timezone: Timezones) => void;
  /** Timezone value */
  timezone: number | Timezones;
  /** Current timeframe value */
  value: TimeframeType;
  /** Reset field event handler */
  onReset?: () => void;
  /** Container variant */
  variant?: Variant;
};

const Timeframe: FC<Props> = ({
  id,
  onTimeframeChange,
  onTimezoneChange,
  onReset,
  timezone,
  value,
  variant = 'primary',
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef(null);
  const timezoneSelectionDisabled = useSelector(getTimezoneSelectionDisabled);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const timezoneContainerRef = useRef<HTMLDivElement>(null);
  const requestFrameRef = React.useRef(null);

  useEffect(() => {
    return () => {
      if (onReset) onReset();
    };
  }, []);

  const timezoneValue = getTimezoneValue(timezone);
  const TABS_SETTINGS = [
    {
      label: t('query_creator_timeframe.relative'),
      id: RELATIVE_TAB,
    },
    {
      label: t('query_creator_timeframe.absolute'),
      id: ABSOLUTE_TAB,
    },
  ];

  return (
    <Container ref={containerRef}>
      <TitleComponent onClick={() => !isOpen && setOpen(true)}>
        {t('query_creator_timeframe.label')}
      </TitleComponent>
      <DropableContainer
        variant={variant}
        onClick={() => !isOpen && setOpen(true)}
        isActive={isOpen}
        value={value}
        dropIndicator
        onDefocus={(event: any) => {
          const path = getEventPath(event);
          if (
            !path?.includes(containerRef.current) &&
            !path?.includes(document.querySelector(`.${TIME_PICKER_CLASS}`))
          ) {
            setOpen(false);
          }
        }}
      >
        {typeof value === 'string' ? (
          <RelativeTimeLabel {...convertRelativeTime(value)} />
        ) : (
          <AbsoluteTimeLabel
            start={value.start}
            end={value.end}
            timezone={timezoneValue}
          />
        )}
      </DropableContainer>
      <Dropdown isOpen={isOpen}>
        <Tabs
          activeTab={typeof value === 'string' ? RELATIVE_TAB : ABSOLUTE_TAB}
          onClick={(tabId) => {
            if (tabId === RELATIVE_TAB) {
              onTimeframeChange(DEFAULT_TIMEFRAME);
            } else {
              onTimeframeChange(getDefaultAbsoluteTime(timezoneValue));
            }
          }}
          tabs={TABS_SETTINGS}
        />
        <SettingsContainer>
          {typeof value === 'string' ? (
            <RelativeTime
              onChange={onTimeframeChange}
              timeLabel={t('query_creator_relative_time.time_label')}
              unitsPlaceholderLabel={t(
                'query_creator_relative_time.units_placeholder'
              )}
              relativityTitleForTodayLabel={t(
                'query_creator_relative_time.relativity_title_for_today'
              )}
              relativityTitleLabel={t(
                'query_creator_relative_time.relativity_title'
              )}
              {...convertRelativeTime(value)}
            />
          ) : (
            <AbsoluteTime
              id={id}
              {...value}
              timezone={timezoneValue}
              onChange={onTimeframeChange}
              startDateLabel={t('absolute_time.start_date')}
              endDateLabel={t('absolute_time.end_date')}
            />
          )}
        </SettingsContainer>
        <div
          data-testid="timezone-container"
          ref={timezoneContainerRef}
          onMouseEnter={(e) => {
            setTooltipVisible(true);
            setTooltipPosition({ x: e.clientX, y: e.clientY });
          }}
          onMouseMove={(e) => {
            const mousePosition = { x: e.clientX, y: e.clientY };
            if (requestFrameRef.current)
              cancelAnimationFrame(requestFrameRef.current);
            requestFrameRef.current = requestAnimationFrame(() => {
              setTooltipPosition(mousePosition);
            });
          }}
          onMouseLeave={() => {
            setTooltipVisible(false);
          }}
        >
          <Notification>
            {t('query_creator_timeframe.notification')}
          </Notification>
          <Timezone
            timezone={timezoneValue}
            onChange={(timezone) => onTimezoneChange(timezone)}
            timezoneLabel={t('query_creator_timezone.label')}
            timezonePlaceholderLabel={t('query_creator_timezone.placeholder')}
          />
          {timezoneSelectionDisabled && tooltipVisible && (
            <AnimatePresence>
              <motion.div
                {...TOOLTIP_MOTION}
                initial={{
                  opacity: 0,
                  x: tooltipPosition.x,
                  y: tooltipPosition.y,
                  top: 0,
                  left: 0,
                }}
                animate={{
                  x: tooltipPosition.x,
                  y: tooltipPosition.y,
                  opacity: 1,
                }}
                style={{
                  position: 'fixed',
                  pointerEvents: 'none',
                  zIndex: UI_LAYERS.tooltip,
                  width: 225,
                }}
              >
                <Tooltip hasArrow={false} fontSize={12}>
                  {t('query_creator_timezone.selection_disabled_description')}
                </Tooltip>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </Dropdown>
    </Container>
  );
};

export default Timeframe;
