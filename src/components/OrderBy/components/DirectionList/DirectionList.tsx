import React, { FC, useState } from 'react';
import {
  Dropdown,
  DropableContainer,
  DropdownList,
  DropdownListContainer,
} from '@keen.io/ui-core';

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
                setActiveItem={({ value }) => value === direction}
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
