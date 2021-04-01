import React, { FC, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Timeframe as QueryTimeframe } from '@keen.io/query';

import {
  Dropdown,
  DropableContainer,
  MousePositionedTooltip,
  DropableContainerVariant as Variant,
  RelativeTime,
  AbsoluteTime,
  Timezone,
  TitleComponent,
  convertRelativeTime,
  TIME_PICKER_CLASS,
} from '@keen.io/ui-core';

import {
  AbsoluteTimeLabel,
  RelativeTimeLabel,
  Navigation,
  TimezoneLoader,
} from './components';
import { Container, SettingsContainer } from './Timeframe.styles';

import { getTimezoneValue } from './utils';
import { getEventPath } from '../../utils';

import { getTimezoneState } from '../../modules/timezone';
import { BodyText } from '@keen.io/typography';

type Props = {
  /** Unique identifer */
  id: string;
  /** Timeframe change event handler */
  onTimeframeChange: (timeframe: QueryTimeframe) => void;
  /** Timezone change event handler */
  onTimezoneChange: (timezone: string) => void;
  /** Timezone value */
  timezone: number | string;
  /** Current timeframe value */
  value: QueryTimeframe;
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
  const {
    timezones,
    isLoading,
    error,
    defaultTimezoneForQuery: defaultTimezone,
    timezoneSelectionDisabled,
  } = useSelector(getTimezoneState);

  useEffect(() => {
    return () => {
      if (onReset) onReset();
    };
  }, []);

  const timezoneValue = getTimezoneValue({
    timezone,
    timezones,
    isLoading,
    defaultTimezone,
  });

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
        <Navigation
          timeframe={value}
          timezone={timezoneValue}
          isDisabled={isLoading || error}
          onTimeframeChange={onTimeframeChange}
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
        {isLoading ? (
          <TimezoneLoader />
        ) : (
          <>
            {error ? (
              <div>error</div>
            ) : (
              <MousePositionedTooltip
                renderContent={() => (
                  <BodyText variant="body3" fontWeight={'normal'}>
                    {t('query_creator_timezone.selection_disabled_description')}
                  </BodyText>
                )}
                isActive={timezoneSelectionDisabled}
                tooltipPortal="#modal-root"
              >
                <Timezone
                  timezone={timezoneValue}
                  timezones={timezones}
                  onChange={(timezone) => onTimezoneChange(timezone)}
                  timezoneLabel={t('query_creator_timezone.label')}
                  disableSelection={timezoneSelectionDisabled}
                  emptySearchLabel={t('query_creator_timezone.empty_search')}
                  timezonePlaceholderLabel={t(
                    'query_creator_timezone.placeholder'
                  )}
                />
              </MousePositionedTooltip>
            )}
          </>
        )}
      </Dropdown>
    </Container>
  );
};

export default Timeframe;
