import React, { FC, useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { useDebounce } from 'react-use';

import { Input, Tooltip, TitleComponent } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { BodyText, FontWeight } from '@keen.io/typography';

import {
  LimitInput,
  TooltipMotion,
  TitleWrapper,
  TooltipContainer,
  Container,
  TooltipWrapper,
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

  const [rangeValidationTooltipVisible, setRangeValidationTooltipVisible] =
    useState(false);

  useDebounce(() => setRangeValidationTooltipVisible(false), 3000, [
    rangeValidationTooltipVisible,
  ]);

  const extractionLimit = useSelector(getExtractionLimit);
  const properties = useSelector(getExtractionPropertyNames);

  const changeLimitHandler = useCallback((eventValue) => {
    if (!eventValue) {
      setRangeValidationTooltipVisible(true);
      return dispatch(setExtractionLimit(undefined));
    }
    const value = parseInt(eventValue);
    if (value > PREVIEW_EVENTS_LIMIT) {
      if (hideLimitHintTrigger.current) {
        clearTimeout(hideLimitHintTrigger.current);
      }
      dispatch(setExtractionLimit(PREVIEW_EVENTS_LIMIT));
      setTooltip({ visible: true });
      hideLimitHintTrigger.current = setTimeout(
        () => setTooltip({ visible: false }),
        HIDE_TIME
      );
    } else if (value <= 0) {
      setRangeValidationTooltipVisible(true);
      dispatch(setExtractionLimit(DEFAULT_LIMIT));
    } else {
      dispatch(setExtractionLimit(value));
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetExtraction());
    };
  }, []);

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
                    <BodyText variant="body2" color={colors.white[500]}>
                      {t('extraction.maximum_events_limit')}
                      <br />
                      <br />
                      <Trans
                        components={{
                          bold: <FontWeight fontWeight="bold" />,
                        }}
                        i18nKey={'extraction.extraction_to_email_limit'}
                      />
                    </BodyText>
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
            onBlur={() =>
              !extractionLimit && dispatch(setExtractionLimit(DEFAULT_LIMIT))
            }
            value={extractionLimit || ''}
            placeholder={t('extraction.limit_placeholder')}
            onChange={(e) => changeLimitHandler(e.target.value)}
          />
          <AnimatePresence>
            {rangeValidationTooltipVisible && (
              <TooltipWrapper
                {...TOOLTIP_MOTION}
                data-testid="validation-tooltip"
              >
                <Tooltip hasArrow={true} arrowDirection="top">
                  <BodyText variant="body2" color={colors.black[100]}>
                    {t('extraction.range_validation_tooltip')}
                  </BodyText>
                </Tooltip>
              </TooltipWrapper>
            )}
          </AnimatePresence>
        </LimitInput>
      </div>
    </Container>
  );
};

export default Extraction;
