import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import {
  ActionButton,
  Dropdown,
  Tooltip,
  Tabs,
  DropableContainer,
  TitleComponent,
} from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import SupportedInterval from '../SupportedInterval';
import CustomInterval from '../CustomInterval';

import { isCustomInterval } from './utils/isCustomInterval';
import { transformInterval } from './utils/transformInterval';
import { getEventPath } from '../../utils';

import {
  Container,
  IntervalManagement,
  IntervalContainer,
  DropdownContainer,
  TooltipMotion,
  TooltipContainer,
  StyledPlaceholder,
  TextCenter,
} from './Interval.styles';

import { getInterval, setInterval } from '../../modules/query';

import {
  STANDARD_TAB,
  CUSTOM_TAB,
  DEFAULT_STANDARD_INTERVAL,
  DEFAULT_CUSTOM_INTERVAL,
} from './constants';

import { TOOLTIP_MOTION } from '../../constants';
import { TitleWrapper } from '../Extraction/Extraction.styles';

type Props = {};

const Interval: FC<Props> = () => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
  });
  const containerRef = useRef(null);

  const dispatch = useDispatch();
  const interval = useSelector(getInterval);

  const customInterval = isCustomInterval(interval);

  const changeHandler = useCallback(
    (interval) => dispatch(setInterval(interval)),
    []
  );

  useEffect(() => {
    return () => dispatch(setInterval(undefined));
  }, []);

  const TABS_SETTINGS = [
    {
      label: t('query_creator_interval.standard'),
      id: STANDARD_TAB,
    },
    {
      label: t('query_creator_interval.custom'),
      id: CUSTOM_TAB,
    },
  ];

  const dropdownMotion = {
    initial: { opacity: 0, bottom: 0, left: '120%', width: 300 },
    animate: { opacity: 1, left: '100%' },
    exit: { opacity: 0, left: '120%' },
  };

  return (
    <Container ref={containerRef}>
      <TitleWrapper>
        <TitleComponent onClick={() => !isOpen && setOpen(true)}>
          {t('query_creator_interval.label')}
        </TitleComponent>
        <TooltipContainer
          onMouseEnter={() => setTooltip({ visible: true })}
          onMouseLeave={() => setTooltip({ visible: false })}
        >
          <Icon type="info" fill={colors.blue['500']} />
          <AnimatePresence>
            {tooltip.visible && (
              <TooltipMotion
                {...TOOLTIP_MOTION}
                data-testid="extraction-limit-hint"
              >
                <Tooltip hasArrow={false} mode="dark">
                  {t('query_creator_interval.tooltip')}
                </Tooltip>
              </TooltipMotion>
            )}
          </AnimatePresence>
        </TooltipContainer>
      </TitleWrapper>
      <IntervalManagement>
        <IntervalContainer>
          <DropableContainer
            variant="secondary"
            placeholder={() => (
              <StyledPlaceholder>Set interval</StyledPlaceholder>
            )}
            onClick={() => !isOpen && setOpen(true)}
            isActive={isOpen}
            value={interval}
            onDefocus={(event: any) => {
              if (!getEventPath(event)?.includes(containerRef.current)) {
                setOpen(false);
              }
            }}
          >
            <TextCenter>{interval && transformInterval(interval)}</TextCenter>
          </DropableContainer>
          <Dropdown isOpen={isOpen} motion={dropdownMotion} fullWidth>
            {isOpen && (
              <Tabs
                activeTab={customInterval ? CUSTOM_TAB : STANDARD_TAB}
                onClick={(tabId) => {
                  tabId === STANDARD_TAB
                    ? dispatch(setInterval(DEFAULT_STANDARD_INTERVAL))
                    : dispatch(setInterval(DEFAULT_CUSTOM_INTERVAL));
                }}
                tabs={TABS_SETTINGS}
              />
            )}
            <DropdownContainer>
              {customInterval ? (
                <CustomInterval interval={interval} onChange={changeHandler} />
              ) : (
                <SupportedInterval
                  interval={interval}
                  onChange={(interval) => {
                    changeHandler(interval);
                    setOpen(false);
                  }}
                />
              )}
            </DropdownContainer>
          </Dropdown>
        </IntervalContainer>
        {interval && (
          <ActionButton
            action="remove"
            onClick={() => dispatch(setInterval(undefined))}
          />
        )}
      </IntervalManagement>
    </Container>
  );
};

export default Interval;
