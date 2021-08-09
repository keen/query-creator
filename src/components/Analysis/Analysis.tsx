import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { colors } from '@keen.io/colors';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@keen.io/react-hooks';
import { BodyText } from '@keen.io/typography';
import {
  Dropdown,
  ScrollWrapper,
  Tooltip,
  DropableContainer,
  EmptySearch,
  TitleComponent,
} from '@keen.io/ui-core';

import { ListItem } from './components';
import { Container, List, Groups, TooltipContainer } from './Analysis.styles';

import { hintMotion } from './motion';
import { transformName } from './utils';

import { useKeypress } from '../../hooks';

import { Analysis as AnalysisType } from '../../types';
import { AnalysisItem } from './types';

import { ANALYSIS_GROUPS } from './constants';
import { KEYBOARD_KEYS } from '../../constants';

type Props = {
  /** Current analysis */
  analysis: AnalysisType;
  /** Analysis change handler */
  onChange: (analysis: AnalysisType) => void;
};

const Analysis: FC<Props> = ({ analysis, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [selectionIndex, setIndex] = useState<number>(null);
  const [hint, showHint] = useState(false);

  const [filteredAnalysis, setFilteredAnalysis] = useState<AnalysisItem[][]>(
    ANALYSIS_GROUPS
  );

  const [tooltip, setTooltip] = useState({
    top: 0,
    bottom: 0,
    height: 0,
    overflow: false,
  });

  const options = useMemo(() => ANALYSIS_GROUPS.flatMap((item) => item), []);

  const tooltipRef = useRef(null);
  const dropdownRef = useRef(null);
  const scrollRef = useRef(null);

  const { searchHandler, searchPhrase, clearSearchPhrase } = useSearch<
    AnalysisItem
  >(options, (searchResult, phrase) => {
    setIndex(null);
    if (phrase) {
      const indexedResults = searchResult.map((item, idx) => ({
        ...item,
        index: idx,
      }));
      setFilteredAnalysis([indexedResults]);
    } else {
      setFilteredAnalysis(ANALYSIS_GROUPS);
    }
  });

  const [firstGroup] = filteredAnalysis;

  const keyboardHandler = useCallback(
    (_e: KeyboardEvent, keyCode: number) => {
      const analyses = filteredAnalysis.flatMap((item) => item);

      switch (keyCode) {
        case KEYBOARD_KEYS.ENTER:
          const { value } = analyses.find(
            ({ index }) => index === selectionIndex
          );
          onChange(value);
          setOpen(false);
          break;
        case KEYBOARD_KEYS.UP:
          if (selectionIndex > 0) {
            setIndex(selectionIndex - 1);
          }
          break;
        case KEYBOARD_KEYS.DOWN:
          if (selectionIndex === null) {
            setIndex(0);
          } else if (selectionIndex < analyses.length - 1) {
            setIndex(selectionIndex + 1);
          }
          break;
        case KEYBOARD_KEYS.ESCAPE:
          setOpen(false);
          break;
      }
    },
    [selectionIndex, filteredAnalysis]
  );

  useKeypress({
    keyboardAction: keyboardHandler,
    handledKeys: [
      KEYBOARD_KEYS.ENTER,
      KEYBOARD_KEYS.ESCAPE,
      KEYBOARD_KEYS.UP,
      KEYBOARD_KEYS.DOWN,
    ],
    addEventListenerCondition: isOpen,
    eventListenerDependencies: [isOpen, selectionIndex, filteredAnalysis],
  });

  useEffect(() => {
    if (
      dropdownRef.current &&
      hint &&
      tooltipRef.current &&
      scrollRef.current
    ) {
      const { clientHeight: height } = tooltipRef.current;
      const { top, bottom } = dropdownRef.current.getBoundingClientRect();

      const scrollTop = scrollRef.current.offsetParent
        ? scrollRef.current.offsetParent.scrollTop
        : 0;

      setTooltip((state) => {
        const tooltipBottom = top + state.top + height;
        const overflow = bottom + scrollTop < tooltipBottom;
        return {
          ...state,
          overflow,
          height,
          top: state.top - scrollTop,
          bottom: state.bottom - scrollTop,
        };
      });
    }
  }, [tooltipRef, dropdownRef, scrollRef, hint]);

  useEffect(() => {
    if (isOpen) {
      const { index } = options.find(({ value }) => value === analysis);
      setIndex(index);
    } else {
      clearSearchPhrase();
      setFilteredAnalysis(ANALYSIS_GROUPS);
    }
  }, [isOpen]);

  return (
    <Container role="listbox">
      <TitleComponent onClick={() => setOpen(true)}>
        {t('query_creator_analysis.label')}
      </TitleComponent>
      <DropableContainer
        onClick={() => !isOpen && setOpen(true)}
        searchPlaceholder={t('query_creator_analysis.search_placeholder')}
        placeholder={t('query_creator_analysis.placeholder')}
        isActive={isOpen}
        value={transformName(analysis)}
        dropIndicator
        searchable
        onSearch={searchHandler}
        variant="secondary"
        onDefocus={() => {
          setOpen(false);
        }}
      >
        <BodyText
          variant="body2"
          color={colors.blue[500]}
          style={{ textTransform: 'capitalize' }}
        >
          {transformName(analysis)}
        </BodyText>
      </DropableContainer>
      <Dropdown ref={dropdownRef} isOpen={isOpen}>
        {searchPhrase && !firstGroup.length ? (
          <EmptySearch
            message={t('query_creator_analysis.empty_search_results')}
          />
        ) : (
          <ScrollWrapper>
            <Groups ref={scrollRef}>
              {filteredAnalysis.map((options, idx) => (
                <List key={idx} role="list">
                  {options.map(({ label, value, index, description }) => (
                    <ListItem
                      key={value}
                      isActive={selectionIndex === index}
                      description={t(description)}
                      analysis={value}
                      onMouseEnter={() => setIndex(index)}
                      onClick={(_e, analysis) => {
                        setOpen(false);
                        onChange(analysis);
                      }}
                      showHint={(value, topPos, bottomPos) => {
                        if (topPos !== 0 && bottomPos !== 0 && value) {
                          setTooltip((state) => ({
                            ...state,
                            top: topPos,
                            bottom: bottomPos,
                          }));
                        }
                        showHint(value);
                      }}
                    >
                      {label}
                    </ListItem>
                  ))}
                </List>
              ))}
            </Groups>
          </ScrollWrapper>
        )}
        {hint && (
          <TooltipContainer
            ref={tooltipRef}
            data-testid="hint-message"
            key="tooltip-container"
            {...hintMotion}
            tooltipY={
              tooltip.overflow ? tooltip.bottom - tooltip.height : tooltip.top
            }
          >
            <Tooltip mode="dark" hasArrow={false}>
              <div
                dangerouslySetInnerHTML={{
                  __html: t(options[selectionIndex].description),
                }}
              />
            </Tooltip>
          </TooltipContainer>
        )}
      </Dropdown>
    </Container>
  );
};

export default Analysis;
