import React, { FC, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Input, DropableContainer } from '@keen.io/ui-core';

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

import { SEPARATOR, MAX_LIST_HEIGHT } from './constants';
import { KEYBOARD_KEYS } from '../../../../constants';

type Props = {
  /** List values */
  items: Array<string | number>;
  /** Change event handler */
  onChange: (value: Array<string | number>) => void;
  /** Type of property */
  propertyType: PropertyType;
};

const FilterListValue: FC<Props> = ({ items, propertyType, onChange }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [editMode, setEditMode] = useState(false);

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
          <Input
            autoFocus
            variant="solid"
            data-testid="list-input"
            placeholder={t('query_creator_filter_list_value.input_placeholder')}
            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.charCode === KEYBOARD_KEYS.ENTER) {
                event.preventDefault();
                updateListHandler(event);
                event.currentTarget.value = '';
              }
            }}
          />
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
