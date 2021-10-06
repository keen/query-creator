import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropableContainer,
  DropdownList,
  KEYBOARD_KEYS,
} from '@keen.io/ui-core';
import { useKeypress } from '@keen.io/react-hooks';

import { Container } from './FilterBoolean.styles';

import { TRUE_LABEL, FALSE_LABEL, OPTIONS } from './constants';

type Props = {
  /** Current value */
  value: boolean;
  /** Change event handler */
  onChange: (value: boolean) => void;
};

const FilterBoolean: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [selectionIndex, setIndex] = useState<number>(null);

  useEffect(() => {
    if (editMode) {
      const index = OPTIONS.findIndex(
        ({ value: operatorValue }) => operatorValue === value
      );
      setIndex(index);
    }
    return () => setIndex(null);
  }, [editMode]);

  const keyboardHandler = (_e: KeyboardEvent, keyCode: number) => {
    switch (keyCode) {
      case KEYBOARD_KEYS.ENTER:
        const value = OPTIONS[selectionIndex].value as boolean;
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
        } else if (selectionIndex < OPTIONS.length - 1) {
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
        onClick={() => !editMode && setEditMode(true)}
        onDefocus={() => setEditMode(false)}
        placeholder={t('query_creator_filter_boolean.placeholder')}
        value={t('query_creator_filter_boolean.placeholder')}
      >
        {value ? TRUE_LABEL : FALSE_LABEL}
      </DropableContainer>
      <Dropdown isOpen={editMode} fullWidth={false}>
        <DropdownList
          items={OPTIONS}
          setActiveItem={({ value }) =>
            OPTIONS[selectionIndex] && value === OPTIONS[selectionIndex].value
          }
          onClick={(_e, { value }) => {
            setEditMode(false);
            onChange(value);
          }}
        />
      </Dropdown>
    </Container>
  );
};

export default FilterBoolean;
