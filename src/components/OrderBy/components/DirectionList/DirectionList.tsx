import React, { FC, useEffect, useState } from 'react';
import {
  Dropdown,
  DropableContainer,
  DropdownList,
  DropdownListContainer,
  KEYBOARD_KEYS,
} from '@keen.io/ui-core';
import { useKeypress } from '@keen.io/react-hooks';

import { Container, OrderList } from './DirectionList.styles';

import { OrderDirection } from '../../types';
import { DIRECTION_OPTIONS } from '../../constants';

type Props = {
  /** Direction value */
  direction?: OrderDirection;
  /** Change event handler */
  onChange: (direction: OrderDirection) => void;
};

const DirectionList: FC<Props> = ({ direction = 'DESC', onChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectionIndex, setIndex] = useState<number>(null);

  useEffect(() => {
    const index = DIRECTION_OPTIONS.findIndex(
      ({ value }) => value === direction
    );
    setIndex(index);
    return () => setIndex(null);
  }, [editMode]);

  const keyboardHandler = (_e: KeyboardEvent, keyCode: number) => {
    switch (keyCode) {
      case KEYBOARD_KEYS.ENTER:
        const { value } = DIRECTION_OPTIONS[selectionIndex];
        onChange(value as OrderDirection);
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
        } else if (selectionIndex < DIRECTION_OPTIONS.length - 1) {
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
        variant="transparent"
        onClick={() => !editMode && setEditMode(true)}
        onDefocus={() => setEditMode(false)}
        value={direction}
      >
        {direction}
      </DropableContainer>
      <Dropdown isOpen={editMode} fullWidth={false}>
        <OrderList data-testid="order-list">
          <DropdownListContainer scrollToActive maxHeight={240}>
            {(activeItemRef) => (
              <DropdownList
                ref={activeItemRef}
                items={DIRECTION_OPTIONS}
                setActiveItem={({ value }) =>
                  value === DIRECTION_OPTIONS[selectionIndex].value
                }
                onClick={(_e, { value }) => {
                  setEditMode(false);
                  onChange(value);
                }}
              />
            )}
          </DropdownListContainer>
        </OrderList>
      </Dropdown>
    </Container>
  );
};

export default DirectionList;
