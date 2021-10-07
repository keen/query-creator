import React, {
  FC,
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropdownListContainer,
  DropdownList,
  KEYBOARD_KEYS,
} from '@keen.io/ui-core';
import { useKeypress } from '@keen.io/react-hooks';

import {
  Container,
  DropableContainer,
  DropdownContainer,
  WarningMessage,
  DefaultLabel,
  ItemContainer,
} from './PropertyTypeCast.styles';

import FiltersContext from '../../FiltersContext';

import { createOptions } from './utils';

import { DATA_TYPES } from './constants';
import { SCHEMA_PROPS } from '../../../../constants';

import { Property } from '../../../../types';

type Props = {
  /** Property */
  property: string;
  /** Property type */
  type: Property;
  /** Change event handler */
  onChange: (type: Property) => void;
};

const PropertyTypeCast: FC<Props> = ({ type, property, onChange }) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [selectionIndex, setIndex] = useState<number>(null);
  const containerRef = useRef(null);
  const { schema } = useContext(FiltersContext);

  const items = createOptions(DATA_TYPES);
  useEffect(() => {
    if (editMode) {
      const index = items.findIndex(({ value }) => value === type);
      setIndex(index);
    }
    return () => setIndex(null);
  }, [editMode]);

  const outsideClick = useCallback(
    (e) => {
      if (
        editMode &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setEditMode(false);
      }
    },
    [editMode, containerRef]
  );

  useEffect(() => {
    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [editMode, containerRef]);

  const schemaType = property ? SCHEMA_PROPS[schema[property]] : null;

  const keyboardHandler = useCallback(
    (_e: KeyboardEvent, keyCode: number) => {
      switch (keyCode) {
        case KEYBOARD_KEYS.ENTER:
          const value = items[selectionIndex].value as Property;
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
          } else if (selectionIndex < items.length - 1) {
            setIndex(selectionIndex + 1);
          }
          break;
        case KEYBOARD_KEYS.ESCAPE:
          setEditMode(false);
          break;
      }
    },
    [items]
  );

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
    <Container
      data-testid="property-type-cast"
      ref={containerRef}
      onClick={(e) => {
        e.stopPropagation();
        !editMode && setEditMode(true);
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        e.keyCode === KEYBOARD_KEYS.ENTER && !editMode && setEditMode(true);
      }}
      role="button"
      tabIndex={0}
    >
      <DropableContainer editMode={editMode} isActive={schemaType !== type}>
        {type}
      </DropableContainer>
      <Dropdown isOpen={editMode} fullWidth={false}>
        <DropdownContainer>
          <WarningMessage>
            {t('query_creator_property_type_cast.cast_message')}
          </WarningMessage>
          <DropdownListContainer scrollToActive maxHeight={240}>
            {(activeItemRef) => (
              <DropdownList
                ref={activeItemRef}
                items={createOptions(DATA_TYPES)}
                renderItem={({ label, value }) => (
                  <ItemContainer>
                    <span>{label}</span>{' '}
                    {value === schemaType && (
                      <DefaultLabel>
                        {t('query_creator_property_type_cast.default_label')}
                      </DefaultLabel>
                    )}
                  </ItemContainer>
                )}
                setActiveItem={({ value }) =>
                  items[selectionIndex] && value === items[selectionIndex].value
                }
                onClick={(_e, { value }) => {
                  setEditMode(false);
                  onChange(value);
                }}
              />
            )}
          </DropdownListContainer>
        </DropdownContainer>
      </Dropdown>
    </Container>
  );
};

export default PropertyTypeCast;
