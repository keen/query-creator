import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Input, Tooltip, TitleComponent } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { AnimatePresence } from 'framer-motion';

import {
  LimitInput,
  HintMessage,
  TooltipMotion,
  TitleWrapper,
  TooltipContainer,
  Container,
} from './Extraction.styles';

import { ExtractionProperties } from './components';

import {
  setPropertyNames,
  setExtractionLimit,
  getExtractionLimit,
  resetExtraction,
  getExtractionPropertyNames,
} from '../../modules/query';

import { TOOLTIP_MOTION } from '../../constants';
import { DEFAULT_LIMIT, PREVIEW_EVENTS_LIMIT, HIDE_TIME } from './constants';

type Props = {
  /** Events collection identifer */
  collection: string;
};

const Extraction: FC<Props> = ({ collection }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hideLimitHintTrigger = useRef(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
  });

  const extractionLimit = useSelector(getExtractionLimit);
  const properties = useSelector(getExtractionPropertyNames);

  const changeLimitHandler = useCallback((eventValue) => {
    if (eventValue) {
      const value = parseInt(eventValue);
      if (value > PREVIEW_EVENTS_LIMIT) {
        if (hideLimitHintTrigger.current)
          clearTimeout(hideLimitHintTrigger.current);
        dispatch(setExtractionLimit(PREVIEW_EVENTS_LIMIT));

        setTooltip({ visible: true });
        hideLimitHintTrigger.current = setTimeout(
          () => setTooltip({ visible: false }),
          HIDE_TIME
        );
      } else {
        dispatch(setExtractionLimit(value));
      }
    } else {
      dispatch(setExtractionLimit(DEFAULT_LIMIT));
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetExtraction());
    };
  }, []);

  const HINT_MARKUP = useMemo(
    () =>
      `${t('extraction.maximum_events_limit')}<br /><br />${t(
        'extraction.email_events_limit_first'
      )} <strong>${t('extraction.extraction_to_email')}</strong>${t(
        'extraction.email_events_limit_second'
      )}`,
    []
  );

  return (
    <Container>
      <ExtractionProperties
        properties={properties ? properties : []}
        collection={collection}
        onSetProperties={(properties) => dispatch(setPropertyNames(properties))}
      />
      <div>
        <TitleWrapper>
          <TitleComponent>{t('extraction.limit_label')}</TitleComponent>
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
                    <HintMessage
                      dangerouslySetInnerHTML={{
                        __html: HINT_MARKUP,
                      }}
                    />
                  </Tooltip>
                </TooltipMotion>
              )}
            </AnimatePresence>
          </TooltipContainer>
        </TitleWrapper>
        <LimitInput>
          <Input
            type="number"
            variant="solid"
            value={extractionLimit ? extractionLimit : DEFAULT_LIMIT}
            placeholder={t('extraction.limit_placeholder')}
            onChange={(e) => changeLimitHandler(e.target.value)}
          />
        </LimitInput>
      </div>
    </Container>
  );
};

export default Extraction;
