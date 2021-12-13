import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dropdown,
  DropdownList,
  DropdownListContainer,
  KEYBOARD_KEYS,
  Loader,
} from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';
import {
  LoaderWrapper,
  SuggestionsWrapper,
  LabelWrapper,
} from './FilterSuggestions.styles';
import { useTranslation } from 'react-i18next';

type Props = {
  filterValue: string;
  onSelect: (value: string) => void;
  suggestions: string[];
  suggestionsVisible: boolean;
  suggestionsLoading: boolean;
};

const FilterSuggestions: FC<Props> = ({
  suggestionsLoading,
  suggestions,
  filterValue,
  onSelect,
  suggestionsVisible,
}) => {
  const { t } = useTranslation();
  const filteredSuggestions = suggestions
    ? suggestions.filter(
        (suggestion) => suggestion && suggestion.startsWith(filterValue)
      )
    : [];

  const [selectionIndex, setIndex] = useState<number>(null);
  const selectionIndexRef = useRef(selectionIndex);
  const suggestionsListRef = useRef(filteredSuggestions);
  selectionIndexRef.current = selectionIndex;
  suggestionsListRef.current = filteredSuggestions;

  const dropdownIsOpen =
    suggestionsVisible &&
    filterValue &&
    (suggestionsLoading || filteredSuggestions.length > 0);

  const keyboardHandler = useCallback(
    (e: KeyboardEvent) => {
      const { current: suggestions } = suggestionsListRef;
      switch (e.keyCode) {
        case KEYBOARD_KEYS.ENTER:
          if (suggestions && suggestions.length) {
            const value = suggestions[selectionIndexRef.current];
            onSelect(value);
          }
          break;
        case KEYBOARD_KEYS.UP:
          e.preventDefault();
          if (selectionIndexRef.current === null) {
            setIndex(0);
          } else if (selectionIndexRef.current > 0) {
            setIndex(selectionIndexRef.current - 1);
          }
          break;
        case KEYBOARD_KEYS.DOWN:
          e.preventDefault();
          if (selectionIndexRef.current === null) {
            setIndex(0);
          } else if (selectionIndexRef.current < suggestions.length - 1) {
            setIndex(selectionIndexRef.current + 1);
          }
          break;
        case KEYBOARD_KEYS.ESCAPE:
          onSelect(null);
          break;
      }
    },
    [filteredSuggestions]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyboardHandler);
    return () => {
      document.removeEventListener('keydown', keyboardHandler);
    };
  }, [dropdownIsOpen]);

  useEffect(() => {
    setIndex(
      filteredSuggestions.findIndex((suggestion) => suggestion === filterValue)
    );
  }, [filterValue]);

  return (
    <Dropdown isOpen={dropdownIsOpen} fullWidth={true}>
      <SuggestionsWrapper>
        <LabelWrapper>
          <BodyText variant="body2" color={colors.gray[500]}>
            {t('query_creator_filters.matching_values')}
          </BodyText>
        </LabelWrapper>
        {suggestionsLoading && (
          <LoaderWrapper data-testid="suggestions-loader">
            <Loader fill={colors.blue['500']} width={50} height={50} />
          </LoaderWrapper>
        )}
        {!suggestionsLoading && filteredSuggestions.length > 0 && (
          <DropdownListContainer
            scrollToActive
            maxHeight={140}
            scrollShadow={true}
          >
            {(activeItemRef) => (
              <DropdownList
                padding="0 0 10px 0"
                ref={activeItemRef}
                items={filteredSuggestions.map((value) => ({
                  label: value,
                  value,
                }))}
                setActiveItem={(_item, idx) =>
                  selectionIndexRef.current === idx
                }
                onClick={(_e, { value }) => {
                  onSelect(value);
                }}
              />
            )}
          </DropdownListContainer>
        )}
      </SuggestionsWrapper>
    </Dropdown>
  );
};

export default FilterSuggestions;
