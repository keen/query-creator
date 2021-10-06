import React, { FC, useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropableContainer,
  DropdownList,
  DropdownListContainer,
  KEYBOARD_KEYS,
} from '@keen.io/ui-core';

import { useKeypress } from '@keen.io/react-hooks';
import { Container, OperatorsList } from './FilterOperator.styles';

import { createOptions, getLabel } from './utils';

import { Operator, Property } from '../../../../types';

type Props = {
  /** Property */
  property?: string;
  /** Property type */
  propertyType: Property;
  /** Operator value */
  operator: Operator;
  /** Change event handler */
  onChange: (operator: Operator) => void;
};

const FilterOperator: FC<Props> = ({
  operator,
  property,
  propertyType,
  onChange,
}) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [selectionIndex, setIndex] = useState<number>(null);
  const operators = useMemo(() => createOptions(propertyType), [propertyType]);
  const propertyRef = useRef(property);

  useEffect(() => {
    if (property && !propertyRef.current) {
      propertyRef.current = property;
      setEditMode(true);
    }
  }, [property]);

  useEffect(() => {
    if (editMode) {
      const index = operators.findIndex(({ value }) => value === operator);
      setIndex(index);
    }
    return () => setIndex(null);
  }, [editMode]);

  const keyboardHandler = (_e: KeyboardEvent, keyCode: number) => {
    switch (keyCode) {
      case KEYBOARD_KEYS.ENTER:
        const value = operators[selectionIndex].value as Operator;
        onChange(value);
        setEditMode(false);
        break;
      case KEYBOARD_KEYS.UP:
        if (selectionIndex > 0) {
          setIndex(selectionIndex - 1);
        }
        break;
      case KEYBOARD_KEYS.DOWN:
        if (selectionIndex === null) {
          setIndex(0);
        } else if (selectionIndex < operators.length - 1) {
          setIndex(selectionIndex + 1);
        }
        break;
      case KEYBOARD_KEYS.ESCAPE:
        setEditMode(false);
        break;
    }
  };

  useKeypress({
    keyboardAction: keyboardHandler,
    handledKeys: [
      KEYBOARD_KEYS.ENTER,
      KEYBOARD_KEYS.ESCAPE,
      KEYBOARD_KEYS.UP,
      KEYBOARD_KEYS.DOWN,
    ],
    addEventListenerCondition: editMode,
    eventListenerDependencies: [editMode],
  });

  return (
    <Container>
      <DropableContainer
        isActive={editMode}
        variant="secondary"
        onClick={() => !editMode && propertyType && setEditMode(true)}
        onDefocus={() => setEditMode(false)}
        placeholder={t('query_creator_filter_operator.placeholder')}
        value={operator}
      >
        {getLabel(propertyType, operator)}
      </DropableContainer>
      <Dropdown isOpen={editMode} fullWidth={false}>
        <OperatorsList data-testid="operators-list">
          <DropdownListContainer scrollToActive maxHeight={240}>
            {(activeItemRef) => (
              <DropdownList
                ref={activeItemRef}
                items={operators}
                setActiveItem={({ value }) =>
                  operators[selectionIndex] &&
                  value === operators[selectionIndex].value
                }
                onClick={(_e, { value }) => {
                  setEditMode(false);
                  onChange(value);
                }}
              />
            )}
          </DropdownListContainer>
        </OperatorsList>
      </Dropdown>
    </Container>
  );
};

export default FilterOperator;
