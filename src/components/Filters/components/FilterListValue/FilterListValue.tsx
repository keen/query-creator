import React, { FC, useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  Input,
  DropableContainer,
  KEYBOARD_KEYS,
} from '@keen.io/ui-core';

import {
  Container,
  List,
  ListItem,
  DropdownContainer,
  ItemContainer,
} from './FilterListValue.styles';

import PropertyGroup from '../../../PropertyGroup';

import Value from './Value';
import { Property as PropertyType } from '../../../../types';

import { getEventPath } from '../../../../utils';

import { MAX_LIST_HEIGHT, SEPARATOR } from './constants';
import { FilterSuggestions } from '../FilterSuggestions';

type Props = {
  /** List values */
  items: Array<string | number>;
  /** Change event handler */
  onChange: (value: Array<string | number>) => void;
  /** Type of property */
  propertyType: PropertyType;
  availableSuggestions: string[];
};

const FilterListValue: FC<Props> = ({
  items,
  propertyType,
  onChange,
  availableSuggestions,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const removeHandler = useCallback(
    (item: string | number) => {
      const updatedList = items.filter((v) => v !== item);
      onChange(updatedList);
    },
    [items, onChange]
  );

  const updateListHandler = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isNumericValue = /^\d+$/;
      const initialValue = e.currentTarget.value;

      let value: string | number;

      if (propertyType === 'String') {
        value = initialValue;
      } else if (propertyType === 'Number') {
        const eventValue = parseFloat(initialValue);
        value = Number.isNaN(eventValue) ? undefined : eventValue;
      } else if (propertyType === 'List') {
        value = isNumericValue.test(initialValue)
          ? parseFloat(initialValue)
          : initialValue;
      }

      if (value && !items.includes(value)) {
        onChange([...items, value]);
      }
    },
    [propertyType, items]
  );

  const [suggestionsVisible, setSuggestionsVisible] = useState<boolean>();

  useEffect(() => {
    if (inputValue) {
      setSuggestionsVisible(true);
    }
  }, [inputValue]);

  return (
    <Container ref={containerRef}>
      <DropableContainer
        isActive={editMode}
        variant="secondary"
        onClick={() => !editMode && setEditMode(true)}
        onDefocus={(event: any) => {
          if (!getEventPath(event)?.includes(containerRef.current)) {
            setEditMode(false);
          }
        }}
        placeholder={t('query_creator_filter_list_value.placeholder')}
        value={items.length ? items : null}
      >
        <ItemContainer>{items.join(SEPARATOR)}</ItemContainer>
      </DropableContainer>
      <Dropdown isOpen={editMode} fullWidth={false}>
        <DropdownContainer>
          <div ref={containerRef}>
            <Input
              autoFocus
              variant="solid"
              data-testid="list-input"
              placeholder={t(
                'query_creator_filter_list_value.input_placeholder'
              )}
              onChange={(event) => {
                setInputValue(event.currentTarget.value);
              }}
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.charCode === KEYBOARD_KEYS.ENTER) {
                  event.preventDefault();
                  updateListHandler(event);
                  event.currentTarget.value = '';
                }
              }}
            />
            {suggestionsVisible && (
              <FilterSuggestions
                suggestionsLoading={false}
                availableSuggestions={availableSuggestions}
                filterValue={inputValue}
                onSelect={(value) => {
                  setSuggestionsVisible(false);
                  if (value && !items.includes(value)) {
                    onChange([...items, value]);
                  }
                }}
                selectedItems={items as string[]}
              />
            )}
          </div>
          <List maxHeight={MAX_LIST_HEIGHT}>
            {items.map((value, idx) => (
              <ListItem key={idx}>
                <PropertyGroup isActive={false}>
                  <Value value={value} removeHandler={removeHandler} />
                </PropertyGroup>
              </ListItem>
            ))}
          </List>
        </DropdownContainer>
      </Dropdown>
    </Container>
  );
};

export default FilterListValue;
