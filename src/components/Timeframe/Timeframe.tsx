import React, {
  FC,
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Timeframe as QueryTimeframe } from '@keen.io/query';
import { BodyText } from '@keen.io/typography';
import {
  Dropdown,
  DropableContainer,
  MousePositionedTooltip,
  DropableContainerVariant as Variant,
  RelativeTime,
  AbsoluteTime,
  Timezone,
  TimezoneError,
  TitleComponent,
  convertRelativeTime,
  TIME_PICKER_CLASS,
  KEYBOARD_KEYS,
} from '@keen.io/ui-core';
import { useKeypress } from '@keen.io/react-hooks';

import {
  AbsoluteTimeLabel,
  RelativeTimeLabel,
  Navigation,
  TimezoneLoader,
} from './components';
import {
  Container,
  ErrorContainer,
  SettingsContainer,
} from './Timeframe.styles';
import { AppContext } from '../../contexts';

import { getTimezoneValue } from './utils';
import { getEventPath } from '../../utils';

import { getTimezoneState } from '../../modules/timezone';

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
  variant = 'secondary',
}) => {
  const { t } = useTranslation();
  const { modalContainer } = useContext(AppContext);

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

  const keyboardHandler = useCallback((_e: KeyboardEvent, keyCode: number) => {
    if (keyCode === KEYBOARD_KEYS.ESCAPE) {
      setOpen(false);
    }
  }, []);

  useKeypress({
    keyboardAction: keyboardHandler,
    handledKeys: [KEYBOARD_KEYS.ESCAPE],
    addEventListenerCondition: isOpen,
    eventListenerDependencies: [isOpen],
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
          <AbsoluteTimeLabel start={value.start} end={value.end} />
        )}
      </DropableContainer>
      <Dropdown isOpen={isOpen}>
        <Navigation
          timeframe={value}
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
          <TimezoneLoader message={t('query_creator_timezone.loading')} />
        ) : (
          <>
            {error ? (
              <ErrorContainer>
                <TimezoneError
                  tooltipPortal={modalContainer}
                  tooltipMessage={t('query_creator_timezone.error')}
                  placeholder={t('query_creator_timezone.placeholder')}
                  label={t('query_creator_timezone.label')}
                />
              </ErrorContainer>
            ) : (
              <MousePositionedTooltip
                renderContent={() => (
                  <BodyText variant="body3" fontWeight="normal">
                    {t('query_creator_timezone.selection_disabled_description')}
                  </BodyText>
                )}
                isActive={timezoneSelectionDisabled}
                tooltipPortal={modalContainer}
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
